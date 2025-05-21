import { defineStore } from 'pinia'
import { pureObject } from '../../libs/object.js'

const defaultPreference = {
  isWindow: false, // 모달창으로 열려있는지 여부
  shortcut: false, // 단축키 사용여부
  module: null, // 모듈 데이터 이름
  moduleSrl: null, // 모듈 데이터 번호
  acceptFileType: 'image/*',
  useThumbnail: false,
  limitCount: 50,
  limitSize: 3 * 1024 * 1024, // 3MB
}

const fileManagerStore = defineStore('file-manager', {
  state: () => ({
    initialized: false,
    preference: pureObject(defaultPreference),
    idx: 0, // 아이템 인덱스 번호. 아이템이 추가될수록 증가한다.
    items: {}, // 아이템 데이터 (key,value)
    index: [], // 아이템의 순서 (key)
    selected: [], // 선택된 아이템의 키
    cropper: {}, // 크로핑 데이터
    windows: [], // 추가로 열려있는 모달의 목록
  }),
  getters: {
    _countItems()
    {
      return Object.keys(this.items)?.length
    },
    _existItem()
    {
      return Object.keys(this.items)?.length > 0
    },
    _existSelected()
    {
      return this.selected.length > 0
    },
  },
  actions: {
    setup(preference = {})
    {
      const _preference = Object.entries(preference)
      for (const [ key, value ] of _preference)
      {
        if (!(key in this.preference)) continue
        this.preference[key] = value
      }
      this.initialized = true
    },
    destroy()
    {
      this.initialized = false
      const _preference = pureObject(defaultPreference)
      for (const [ key, value ] of Object.entries(_preference))
      {
        this.preference[key] = value
      }
      this.idx = 0
      this.items = {}
      this.index = []
      this.selected = []
      this.cropper = {}
      this.windows = []
    },
    /**
     * @param {number} data.progress
     */
    addFile(data = {})
    {
      const newIdx = this.idx += 1
      if (this.items[newIdx]) return
      this.items[newIdx] = data
      this.index.push(newIdx)
      this.idx = newIdx
      return newIdx
    },
    updateFile(idx, data)
    {
      if (!this.items[idx]) return
      this.items[idx] = data
    },
    removeFile(idx)
    {
      if (!this.items[idx]) return
      delete this.items[idx]
      this.index.splice(idx, 1)
    },
  },
})

export default fileManagerStore
