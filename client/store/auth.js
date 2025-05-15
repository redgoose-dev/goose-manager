import { defineStore } from 'pinia'
import { localRequest } from '../libs/api.js'
import { preferenceStore } from './app.js'

export const authStore = defineStore('auth', {
  state: () => ({
    token: '',
    apiUrl: '',
    provider: undefined,
  }),
  getters: {},
  actions: {
    setup(data)
    {
      this.token = data.token
      this.apiUrl = data.apiUrl
      this.provider = data.provider
      const preference = preferenceStore()
      preference.setup(data.preference)
    },
    destroy()
    {
      this.token = ''
      this.apiUrl = ''
      this.provider = undefined
      const preference = preferenceStore()
      preference.destroy()
    },
    async checkin()
    {
      try
      {
        // check store
        if (this.token && this.apiUrl && this.provider) return true
        // request server for get cookie
        const res = await localRequest({
          method: 'post',
          url: '/zone/checkin/',
        })
        // switching
        if (res.status === 200)
        {
          this.setup(res)
          return true
        }
        else
        {
          throw new Error('Failed check in')
        }
      }
      catch (e)
      {
        return false
      }
    },
    async checkout()
    {
      await localRequest({
        method: 'post',
        url: '/zone/checkout/',
        headers: { Authorization: this.token },
      })
      this.destroy()
      location.href = `/auth/login/`
    },
    async login(id, password, save)
    {
      const res = await localRequest({
        method: 'post',
        url: '/zone/login/',
        body: {
          id,
          password,
          save,
        },
      })
      this.setup(res)
    },
  },
})
