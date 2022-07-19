import { defineStore } from 'pinia'
import { pureObject } from '../libs/object'
import * as storage from '../libs/storage'

declare interface FilterArticles {
  type?: string
  order?: string
  sort?: string
  theme?: string
  keyword?: string
}
declare interface FilterChecklist {
  dateStart?: string
  dateEnd?: string
  sort?: string
  keyword?: string
}
interface Filters {
  articles: FilterArticles
  checklist: FilterChecklist
}

const defaultFilters: Filters = {
  articles: {
    type: 'all',
    order: 'srl',
    sort: 'desc',
    theme: 'card',
    keyword: '',
  },
  checklist: {
    dateStart: '',
    dateEnd: '',
    sort: 'desc',
    keyword: '',
  },
}

export const filtersStore = defineStore('filters', {
  state(): Filters
  {
    return pureObject(defaultFilters)
  },
  getters: {},
  actions: {
    setup(): void
    {
      let src = storage.get('filters')
      if (src?.articles) this.articles = src.articles
      if (src?.checklist) this.checklist = src.checklist
    },
    save(type: string, src: any): void
    {
      switch (type) {
        case 'articles':
          this.articles.type = src.type
          this.articles.order = src.order
          this.articles.sort = src.sort
          this.articles.theme = src.theme
          this.articles.keyword = src.keyword
          break
        case 'checklist':
          this.checklist.dateStart = src.dateStart
          this.checklist.dateEnd = src.dateEnd
          this.checklist.sort = src.sort
          this.checklist.keyword = src.keyword
          break
      }
      storage.set('filters', <Filters>pureObject({
        articles: this.articles,
        checklist: this.checklist,
      }))
    },
    getFilters(): Filters
    {
      let filters = storage.get('filters')
      return filters || pureObject(defaultFilters)
    },
  },
})
