export declare interface Preference {
  general: {}
  dashboard: {
    title: string
    description: string
    contents: {
      module: string
      options: {
        size: number
      }
    }[]
  }
  navigation: {
    name: string
    icon: string
    link?: string
    active?: string
    children?: {
      name: string
      link?: string
      href?: string
      target?: string
      icon: string
      active?: string
    }[]
  }[]
  nests: {
    uploadFileCount: number
    limitUploadFile: number
    limitUploadFiles: number
  }
  articles: {
    pageCount: number
    pageRange: number
    displayDateField: string
  }
  files: {
    pagePerSize: number
    acceptFileType: string
    globalPath: string
  },
  checklist: {
    resetTime: string
    dateFormat: string
    pageCount: number
    pageRange: number
    limitUploadFilesCount: number
    limitUploadFileSize: number
  }
}
