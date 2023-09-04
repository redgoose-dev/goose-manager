import { defineStore } from 'pinia'
import * as storage from '../libs/storage'
import { pureObject } from '../libs/object'

const { VITE_TITLE, VITE_DESCRIPTION, VITE_SHORT_NAME  } = import.meta.env
const defaultHead = {
  title: VITE_TITLE || 'Goose Manager',
  description: VITE_DESCRIPTION || '',
  shortName: VITE_SHORT_NAME || 'GOOSE',
  theme: storage.get('head')?.theme || 'system',
  blink: false,
}

export const headStore = defineStore('head', {
  state()
  {
    return pureObject(defaultHead)
  },
  getters: {},
  actions: {
    updateStorage(obj)
    {
      storage.set('head', obj)
    },
    changeTheme(value)
    {
      value = value || this.theme
      switch(value)
      {
        case 'light':
        case 'dark':
          this.theme = value
          break
        default:
          this.theme = 'system'
          break
      }
      const $html = document.querySelector('html')
      $html.dataset['theme'] = this.theme
    },
  },
})
