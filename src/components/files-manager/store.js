import { defineStore } from 'pinia'
import { pureObject } from '../../libs/object'
import * as storage from '../../libs/storage'

const STORAGE_KEY = 'file-manager'
const defaultStorageStructure = {
  attachmentTheme: 'thumbnail', // thumbnail,list
  attachmentDisplayImage: false,
  attachmentGroup: '', // type,size,imageSize
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
  getters: {
    // TODO: 그룹타입에 따라 첨부파일 목록의 형태가 달라지는데 여기서 뽑아내는게 좋을거 같다.
    // TODO: 그룹타입 값이 없으면 그대로 사용하지만 있으면 목록 구조가 달라진다.
    // TODO: post,global 값이 따로따로 존재하는데 이걸 어떻게 풀어갈지 좀 고민이 필요하다.
  },
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
        this.attachmentGroup = storageResource.attachmentGroup
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
    },
    changeGroup(value = '')
    {
      this.attachmentGroup = value
      updateStorage({ attachmentGroup: value })
    },
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
