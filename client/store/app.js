import { defineStore } from 'pinia'
import { pureObject } from '../libs/object.js'

const preferenceKeys = [ 'general', 'dashboard', 'nest', 'article', 'file', 'checklist', 'navigation' ]

export const currentStore = defineStore('current', {
  state: () => ({
    blink: false,
  }),
})

export const preferenceStore = defineStore('preference', {
  state: () => {
    let result = {}
    for (const key of preferenceKeys) result[key] = undefined
    return result
  },
  getters: {
    _pure: (data) => {
      let result = {}
      for (const key of preferenceKeys) result[key] = data[key]
      return pureObject(result)
    }
  },
  actions: {
    setup(pref)
    {
      const arr = Object.entries(pref)
      for (const [ key, value ] of arr)
      {
        if (!value) continue
        this[key] = value
      }
    },
    async update()
    {
      // TODO: save preference
      console.log('update preference')
    },
    destroy()
    {
      for (const key of preferenceKeys)
      {
        this[key] = undefined
      }
    },
  },
})
