import { defineStore } from 'pinia'
import { pureObject } from '../libs/object'

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
    },
  },
})
