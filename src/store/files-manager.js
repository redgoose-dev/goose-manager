import { defineStore } from 'pinia'
import { pureObject } from '../libs/object'
import * as storage from '../libs/storage'

const STORAGE_KEY = 'file-manager'
const defaultStorageStructure = {
  attachmentTheme: 'thumbnail', // thumbnail,list
  attachmentDisplayImage: false,
}
const defaultStructure = {
  tab: 'global',
  post: {
    module: '',
    targetSrl: NaN,
    cropper: {},
    thumbnail: {},
    index: [],
    idx: 0,
    selected: [],
    thumbnailType: undefined,
  },
  global: {
    path: 'assets',
    index: [],
    idx: 0,
    selected: [],
  },
  acceptFileType: 'image/*',
  fullSize: false,
  window: [],
  useThumbnail: false,
  markdown: false,
  limitSelect: 0,
  useShortcut: false,
  ...defaultStorageStructure,
}

export const fileManagerStore = defineStore('file-manager', {
  state()
  {
    return pureObject(defaultStructure)
  },
  getters: {},
  actions: {
    setup()
    {
      const src = pureObject(defaultStructure)
      this.tab = src.tab
      this.post = src.post
      this.global = src.global
      this.acceptFileType = src.acceptFileType
      this.fullSize = src.fullSize
      this.window = src.window
      // from storage
      const storageResource = storage.get(STORAGE_KEY)
      if (storageResource)
      {
        this.attachmentTheme = storageResource.attachmentTheme
        this.attachmentDisplayImage = storageResource.attachmentDisplayImage
      }
    },
    changeAttachmentTheme(newTheme)
    {
      this.attachmentTheme = newTheme
      updateStorage({ attachmentTheme: newTheme })
    },
    changeAttachmentDisplayImage(value)
    {
      this.attachmentDisplayImage = value
      updateStorage({ attachmentDisplayImage: value })
    }
  },
})

function updateStorage(src)
{
  const res = storage.get(STORAGE_KEY) || {}
  storage.set(STORAGE_KEY, pureObject({
    ...defaultStorageStructure,
    ...res,
    ...src,
  }))
}
