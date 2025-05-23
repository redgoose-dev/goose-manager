import { defineStore } from 'pinia'
import { pureObject } from '../../libs/object.js'

const defaultPreference = {
  isWindow: false, // 모달창으로 열려있는지 여부
  shortcut: false, // 단축키 사용여부
  module: null, // 모듈 데이터 이름
  moduleSrl: null, // 모듈 데이터 번호
  acceptFileType: 'image/*',
  useThumbnail: false,
  limitCount: 10,
  limitSize: 3 * 1024 * 1024, // 3MB
}
let lastSelectedKey = NaN

const fileManagerStore = defineStore('file-manager', {
  state: () => ({
    initialized: false,
    preference: pureObject(defaultPreference),
    idx: 0, // 아이템 인덱스 번호. 아이템이 추가될수록 증가한다.
    items: {}, // 아이템 데이터 (key,value)
    index: [], // 아이템의 순서 (key)
    selected: {}, // 선택된 아이템의 키
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
      return Object.values(this.selected).some(value => value === true)
    },
    _selectedFilesIndex()
    {
      let result = []
      for (const [ key, value ] of Object.entries(this.selected))
      {
        if (value) result.push(Number(key))
      }
      return result
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
      this.selected = {}
      this.cropper = {}
      this.windows = []
    },
    /**
     * add file
     * @param {object} data
     */
    addFile(data = {})
    {
      const newIdx = this.idx += 1
      if (this.items[newIdx]) return
      this.items[newIdx] = data
      this.index.unshift(newIdx)
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
    selectFile(idx, $event)
    {
      if ($event.metaKey)
      {
        // 메타키를 누르고 있을때
        this.selected[idx] = !this.selected[idx]
        lastSelectedKey = this.selected[idx] ? idx : NaN
      }
      else if ($event.shiftKey)
      {
        // 쉬프트키를 누르고 있을때
        let range = [
          isNaN(lastSelectedKey) ? this.index[0] : lastSelectedKey,
          idx,
        ].sort((a, b) => (a - b))
        range = this.index.filter(n => n >= range[0] && n <= range[1])
        this.selectAllFiles(false)
        range.forEach(key => {
          this.selected[key] = true
        })
        lastSelectedKey = range[0]
      }
      else
      {
        // 아무키도 누르지 않을때
        const count = Object.values(this.selected).filter(Boolean).length
        switch (count)
        {
          case 0: // 선택된것이 없을때
            this.selected[idx] = true
            break
          case 1: // 선택된게 1개일때
            if (!!this.selected[idx])
            {
              delete this.selected[idx]
            }
            else
            {
              this.selectAllFiles(false)
              this.selected[idx] = true
            }
            break
          default: // 여러개 선택되어 있을때
            this.selectAllFiles(false)
            this.selected[idx] = true
            break
        }
        lastSelectedKey = this.selected[idx] ? idx : NaN
      }
    },
    selectAllFiles(sw)
    {
      if (sw === undefined)
      {
        sw = !(Object.values(this.selected).some(value => value === true))
      }
      const index = sw ? this.index : Object.keys(this.selected)
      index.forEach(key => {
        if (sw)
        {
          this.selected[key] = sw
        }
        else
        {
          delete this.selected[key]
        }
      })
      lastSelectedKey = NaN
    },
  },
})

export default fileManagerStore
