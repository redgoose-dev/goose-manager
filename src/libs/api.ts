import { $fetch } from 'ohmyfetch'
import type { $Fetch, FetchOptions } from 'ohmyfetch';
import store from '../store-legacy'
import { authStore } from '../store/auth'
import { getPath, serialize } from './string'
import type { ResponseService } from './api.d'

let instance: $Fetch
let headers: { [key: string]: any }
let timer: any

function setup(): void
{
  const auth = authStore()
  instance = $fetch.create(<FetchOptions>{
    baseURL: API_URL,
    retry: 0,
    responseType: 'json',
  })
  headers = { 'Authorization': `Bearer ${auth.token}` }
}

export async function get(url: string, params?: AnyObject): Promise<ResponseService>
{
  if (!instance) setup()
  let res: ResponseService = await instance(`${url}${serialize(params, true)}`, {
    method: 'get',
    headers: headers,
  })
  checkStatus(res)
  if (res._token) refreshToken(res._token)
  return res
}

export async function post(url: string, data?: any, _options?: any): Promise<ResponseService>
{
  if (!instance) setup()
  let res: ResponseService = await instance(url, {
    method: 'post',
    headers: headers,
    ...(_options || {}),
    ...(data ? { body: data } : {}),
    ...(_options?.headers ? { headers, ..._options.headers } : {}),
  })
  checkStatus(res)
  if (res._token) refreshToken(res._token)
  return res
}


/**
 * Utility Area
 */

function checkStatus(src: ResponseService): void
{
  if (!src.success) throw new Error(src.message || 'An unknown error has occurred.')
}

export function formData(src?: AnyObject): FormData|null
{
  if (!src) return null
  let data = new FormData()
  Object.keys(src).forEach(o => data.append(o, src[o]))
  return data
}

export function checkForms(src: any): void
{
  Object.keys(src).forEach((key: string|number) => {
    if (!!src[key].error) throw new Error(src[key].error)
  })
}

function refreshToken(token: string): void
{
  const delay = 2000
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    let res = await $fetch(getPath(`${BASE_URL}/local/refresh-token/`), {
      method: 'post',
      responseType: 'json',
      retry: 0,
      body: {
        token,
      },
    });
    if (res.token) store.state.token = res.token
    timer = undefined
  }, delay)
}
