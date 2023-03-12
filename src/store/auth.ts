import { defineStore } from 'pinia'
import { $fetch } from 'ofetch'
import { preferenceStore } from './preference'
import { getPath } from '../libs/string'

interface AuthUser {
  srl: number
  email: string
  name: string
  admin: boolean
}
interface Auth {
  token: string
  user?: AuthUser
}


export const authStore = defineStore('auth', {
  state(): Auth
  {
    return {
      token: '',
      user: undefined,
    }
  },
  getters: {},
  actions: {
    setup(token: string, user: AuthUser): void
    {
      this.token = token
      this.user = user
    },
    async check(): Promise<boolean>
    {
      try
      {
        // check store
        if (this.token && this.user?.srl) return true
        // request server for get cookie
        const { success, data } = await $fetch(getPath(`${BASE_URL}/local/auth/`), {
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
    async logout(): Promise<void>
    {
      let { success } = await $fetch(getPath(`${BASE_URL}/local/logout/`), {
        method: 'post',
        responseType: 'json',
        retry: 0,
      })
      if (!success) throw new Error('Failed request')
      location.href = getPath(`${BASE_URL}/auth/login/`)
    },
  },
})
