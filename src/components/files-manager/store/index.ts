import { defineStore } from 'pinia'
import { pureObject } from '../../../libs/object'

export declare interface Structure {
  tab: string
  post: {
    module: string
    targetSrl: number
    cropper: {
      [key: string]: any
    }
    thumbnail: {
      [key: string]: any
    }
    index: any
    idx: number
    selected: []
    limitCount: number
    limitSize: number
    thumbnailType: string
  }
  global: {
    path: string
    index: any[]
    idx: number
    selected: any[]
  }
  acceptFileType: string
  fullSize: boolean
  window: string[]
  useThumbnail: boolean
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
    thumbnailType: undefined
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
}

export const fileManagerStore = defineStore('file-manager', {
  state(): Structure
  {
    return pureObject(defaultStructure)
  },
  getters: {},
  actions: {
    setup(): void
    {
      const src: Structure = pureObject(defaultStructure)
      this.tab = src.tab
      this.post = src.post
      this.global = src.global
      this.acceptFileType = src.acceptFileType
      this.fullSize = src.fullSize
      this.window = src.window
    },
  },
})
