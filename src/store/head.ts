import { defineStore } from 'pinia'
import * as storage from '../libs/storage'
import { pureObject } from '../libs/object'

export declare interface Head {
  title: string
  description: string
  shortName: string
  theme: string
  blink: boolean
}

const defaultHead: Head = {
  title: import.meta.env.VITE_TITLE || 'Goose Manager',
  description: DESCRIPTION || '',
  shortName: SHORT_NAME || 'GOOSE',
  theme: storage.get('head')?.theme || 'system',
  blink: false,
}

export const headStore = defineStore('head', {
  state(): Head
  {
    return pureObject(defaultHead)
  },
  getters: {},
  actions: {
    updateStorage(obj: any): void
    {
      storage.set('head', obj)
    },
    changeTheme(value?: string): void
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
      const $html = document.querySelector('html') as HTMLHtmlElement
      $html.dataset['theme'] = this.theme
    },
  },
})
