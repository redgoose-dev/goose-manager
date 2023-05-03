declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare global {
  // env
  const DEBUG: boolean
  const DEVELOPMENT: boolean
  const DESCRIPTION: string
  const STORAGE_PREFIX: string
  const BASE_URL: string
  const API_URL: string
  const SHORT_NAME: string

  // window
  export interface Window {
    DEBUG: boolean
    DEVELOPMENT: boolean
    on: any
    off: any
  }
}

export {}
