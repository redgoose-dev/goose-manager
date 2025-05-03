import { defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import * as api from '../libs/api.js'

export const authStore = defineStore('auth', {
  state: () => ({
    token: '',
    apiUrl: '',
    account: undefined,
  }),
  getters: {},
  actions: {
    setup({ token, apiUrl, account })
    {
      this.token = token
      this.apiUrl = apiUrl
      this.account = account
    },
    destroy()
    {
      this.token = ''
      this.apiUrl = ''
      this.account = undefined
    },
    async checkin()
    {
      try
      {
        // check store
        if (this.token && this.account) return true
        // request server for get cookie
        const res = await $fetch(`/zone/checkin/`, {
          method: 'post',
          responseType: 'json',
        })
        // TODO: preference 데이터도 가져와서 셋업
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
      try
      {
        await $fetch('/zone/checkout/', {
          method: 'post',
          responseType: 'json',
        })
      }
      catch (e)
      {}
      finally
      {
        this.destroy()
        location.href = `/auth/login/`
      }
    },
  },
})
