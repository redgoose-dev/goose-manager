import { defineStore } from 'pinia'
import { pureObject } from '../libs/object.js'
import { defaultPreference } from '../libs/defaults.js'

export const currentStore = defineStore('current', {
  state: () => ({
    blink: false,
  }),
})

export const preferenceStore = defineStore('preference', {
  state()
  {
    return pureObject(defaultPreference)
  },
  getters: {
    pure: ({ general, dashboard, navigation, nests, articles, files, checklist }) => {
      return pureObject({
        general,
        dashboard,
        navigation,
        nests,
        articles,
        files,
        checklist,
      })
    }
  },
  actions: {
    async setup()
    {
      // TODO: preference 데이터도 가져와서 셋업
    },
    async save()
    {
      // TODO: save preference
    },
  },
})
