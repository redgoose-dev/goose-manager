import { defineStore } from 'pinia'
import { pureObject } from '../../libs/object.js'

const defaultPreference = {
  tab: null, // 현재 열려있는 탭
  isWindow: false, // 모달창으로 열려있는지 여부
  shortcut: false, // 단축키 사용여부
  module: null, // 모듈 데이터 이름
  moduleSrl: null, // 모듈 데이터 번호
  acceptFileType: 'image/*',
}

const fileManagerStore = defineStore('file-manager', {
  state: () => ({
    initialized: false,
    preference: pureObject(defaultPreference),
    idx: 0, // 아이템 인덱스 번호. 아이템이 추가될수록 증가한다.
    items: {}, // 아이템 데이터 (key,value)
    index: [], // 아이템의 순서 (key)
    selected: [], // 선택된 아이템의 키
    windows: [], // 추가로 열려있는 모달의 목록
    cropper: {}, // 크로핑 데이터
  }),
  getters: {
    //
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
      // reset preference
      const _preference = pureObject(defaultPreference)
      for (const [ key, value ] of Object.entries(_preference))
      {
        this.preference[key] = value
      }
      // reset items
      this.idx = 0
      this.items = {}
      this.index = []
      this.selected = []
      this.windows = [] // TODO: 모달창 전부 닫아야 할듯한데..
      this.cropper = {}
    },
  },
})

export default fileManagerStore
