import { ofetch } from 'ofetch'
import { authStore } from '../store/auth'
import { getPath, serialize } from './string'

const { VITE_API_URL } = import.meta.env
let instance
let headers
let timer

function setup()
{
  const auth = authStore()
  instance = ofetch.create({
    baseURL: VITE_API_URL,
    retry: 0,
    responseType: 'json',
  })
  headers = { 'Authorization': `Bearer ${auth.token}` }
}

export async function get(url, params)
{
  if (!instance) setup()
  let res = await instance(`${url}${serialize(params, true)}`, {
    method: 'get',
    headers: headers,
  })
  checkStatus(res)
  if (res._token) refreshToken(res._token)
  return res
}

export async function post(url, data, _options)
{
  if (!instance) setup()
  let res = await instance(url, {
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

function checkStatus(src)
{
  if (!src.success) throw new Error(src.message || 'An unknown error has occurred.')
}

export function formData(src)
{
  if (!src) return null
  let data = new FormData()
  Object.keys(src).forEach(o => data.append(o, src[o]))
  return data
}

export function checkForms(src)
{
  Object.keys(src).forEach(key => {
    if (!!src[key].error) throw new Error(src[key].error)
  })
}

function refreshToken(token)
{
  const auth = authStore()
  const delay = 2000
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    let res = await ofetch(getPath(`${import.meta.env.VITE_BASE_URL}/local/refresh-token/`), {
      method: 'post',
      responseType: 'json',
      retry: 0,
      body: { token },
    })
    if (res.token) auth.token = res.token
    timer = undefined
  }, delay)
}
