import { defineStore } from 'pinia'
import { pureObject } from '../libs/object'
import * as storage from '../libs/storage'

const defaultFilters = {
  data: {},
}

export const filtersStore = defineStore('filters', {
  state()
  {
    return pureObject(defaultFilters)
  },
  getters: {},
  actions: {
    setup()
    {
      this.data = storage.get('filters') || pureObject(defaultFilters.data)
    },
    save(type, src)
    {
      this.data[type] = src
      storage.set('filters', pureObject(this.data))
    },
    getFilter(key)
    {
      return this.data[key] || null
    },
  },
})
