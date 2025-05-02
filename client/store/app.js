import { defineStore } from 'pinia'

export const currentStore = defineStore('current', {
  state: () => ({
    blink: false,
  }),
})
