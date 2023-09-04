import { defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import { preferenceStore } from './preference'
import { getPath } from '../libs/string'

export const authStore = defineStore('auth', {
  state()
  {
    return {
      token: '',
      user: undefined,
    }
  },
  getters: {},
  actions: {
    setup(token, user)
    {
      this.token = token
      this.user = user
    },
    async check()
    {
      try
      {
        // check store
        if (this.token && this.user?.srl) return true
        // request server for get cookie
        const { success, data } = await $fetch(getPath(`${import.meta.env.VITE_BASE_URL}/local/auth/`), {
          method: 'post',
          responseType: 'json',
          retry: 0,
        })
        if (!success) throw new Error('failed auth')
        // setup store
        const { token, user } = data
        const preference = preferenceStore()
        this.setup(token, user)
        await preference.setup()
        return true
      }
      catch (e)
      {
        return false
      }
    },
    async logout()
    {
      let { success } = await $fetch(getPath(`${import.meta.env.VITE_BASE_URL}/local/logout/`), {
        method: 'post',
        responseType: 'json',
        retry: 0,
      })
      if (!success) throw new Error('Failed request')
      location.href = getPath(`${import.meta.env.VITE_BASE_URL}/auth/login/`)
    },
  },
})
