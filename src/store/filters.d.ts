export declare interface FilterArticles {
  type: string
  order: string
  sort: string
  theme: string
  keyword: string
}

export declare interface FilterChecklist {
  dateStart: string
  dateEnd: string
  sort: string
  keyword: string
}

export declare interface Filters {
  articles: FilterArticles
  checklist: FilterChecklist
}
