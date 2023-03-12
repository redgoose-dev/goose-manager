import { $fetch } from 'ofetch'
import type { $Fetch, FetchOptions } from 'ofetch'
import { authStore } from '../store/auth'
import { getPath, serialize } from './string'

interface Response {
  success: boolean
  code: number
  message?: string
  data?: any
  query?: string
  time?: string
  url?: string
  srl?: number
  _token?: string
}

let instance: $Fetch
let headers: any
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

export async function get(url: string, params?: any): Promise<Response>
{
  if (!instance) setup()
  let res: Response = await instance(`${url}${serialize(params, true)}`, {
    method: 'get',
    headers: headers,
  })
  checkStatus(res)
  if (res._token) refreshToken(res._token)
  return res
}

export async function post(url: string, data?: any, _options?: any): Promise<Response>
{
  if (!instance) setup()
  let res: Response = await instance(url, {
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

function checkStatus(src: Response): void
{
  if (!src.success) throw new Error(src.message || 'An unknown error has occurred.')
}

export function formData(src?: any): FormData|null
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
  const auth = authStore()
  const delay = 2000
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    let res = await $fetch(getPath(`${BASE_URL}/local/refresh-token/`), {
      method: 'post',
      responseType: 'json',
      retry: 0,
      body: { token },
    })
    if (res.token) auth.token = res.token
    timer = undefined
  }, delay)
}
