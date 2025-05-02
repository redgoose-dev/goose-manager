import { $fetch } from 'ofetch'
import { authStore } from '../store/auth.js'

let instance = $fetch.create({
  retry: 0,
  responseType: 'json',
})
export let baseUrl = ''

export async function request(method = 'get', url, options = {})
{
  try
  {
    const auth = authStore()
    console.log('request', method, url, options)
    return {}
  }
  catch (e)
  {
    // TODO: handle error
  }
}
