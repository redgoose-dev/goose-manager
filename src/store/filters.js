import { defineStore } from 'pinia'
import { pureObject } from '../libs/object'
import * as storage from '../libs/storage'

const defaultFilters = {
  articles: {
    type: 'all',
    order: 'srl',
    sort: 'desc',
    theme: 'card',
  },
  checklist: {
    dateStart: '',
    dateEnd: '',
    sort: 'desc',
  },
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
      let src = storage.get('filters')
      if (src?.articles) this.articles = src.articles
      if (src?.checklist) this.checklist = src.checklist
    },
    save(type, src)
    {
      switch (type) {
        case 'articles':
          this.articles.type = src.type
          this.articles.order = src.order
          this.articles.sort = src.sort
          this.articles.theme = src.theme
          break
        case 'checklist':
          this.checklist.dateStart = src.dateStart
          this.checklist.dateEnd = src.dateEnd
          this.checklist.sort = src.sort
          break
      }
      storage.set('filters', pureObject({
        articles: {
          ...this.articles,
        },
        checklist: {
          ...this.checklist,
        },
      }))
    },
    getFilters()
    {
      let filters = storage.get('filters')
      return filters || pureObject(defaultFilters)
    },
  },
})
