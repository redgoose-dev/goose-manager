import { $fetch } from 'ofetch'
import { authStore } from '../store/auth.js'
import { filterObjectToQuery } from './object.js'
import ServiceError from './ServiceError.js'

function _fetch(url, options)
{
  return new Promise((resolve, reject) => {
    $fetch(url, {
      onResponse: ({ request, response, options }) => {
        // console.warn('[ON_RESPONSE]', response)
        if (!response.ok) return
        resolve({
          status: response.status,
          data: response._data,
        })
      },
      onResponseError: ({ request, response, options }) => {
        // console.error('[ON_RESPONSE_ERROR]', response)
        reject({
          status: response.status,
          message: response._data,
        })
      },
      ...options,
    }).then()
  })
}

/**
 * request api
 * @param {string} url
 * @param {object} options
 * @param {boolean} retried 재발급으로 다시 시도했는지 여부
 * @return {Promise<object>}
 */
export async function request(url, options = {}, retried = false)
{
  const auth = authStore()
  try
  {
    if (!auth.apiUrl) new Error('No API url')
    if (!auth.token) new Error('No token')
    const { method, query, body, headers } = options
    let _options = {
      baseURL: auth.apiUrl,
      method,
      headers: {
        'Authorization': auth.token,
        ...headers,
      },
      query: query ? filterObjectToQuery(query) : undefined,
      body,
      retry: 0,
      timeout: 15000,
    }
    const res = await _fetch(url, _options)
    return res.data
  }
  catch (e)
  {
    if (e instanceof Error)
    {
      throw new ServiceError(e.message, { error: e })
    }
    else
    {
      const { status, message } = e
      if (!retried && status === 401 && auth.token)
      {
        try
        {
          await auth.renew()
        }
        catch(_e)
        {
          throw new ServiceError('Failed renew token', { status: 401 })
        }
        return await request(url, options, true)
      }
      else
      {
        throw new ServiceError(message, { status })
      }
    }
  }
}

/**
 * upload file
 * https://grok.com/chat/0625ae77-9f29-4c8c-80d0-df92fed3b13e
 * @param {object} options
 * @return {Promise<any>}
 */
export function upload(options = {})
{
  const { method, url, data, onProgress, onComplete, onError } = options
  const auth = authStore()
  const xhr = new XMLHttpRequest()
  const _formData = formData(data)
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) onProgress(e.total, e.loaded)
  })
  xhr.addEventListener('load', () => {
    onComplete(JSON.parse(xhr.responseText))
  })
  xhr.addEventListener('error', (e) => {
    onError(e)
  })
  xhr.open(method, `${auth.apiUrl}${url}`)
  xhr.setRequestHeader('Authorization', auth.token)
  xhr.send(_formData)
}

/**
 * convert object to FormData
 * @param {object} src
 * @return {FormData}
 */
export function formData(src)
{
  if (!src) return null
  let data = new FormData()
  Object.keys(src).forEach(o => {
    if (!o || src[o] === undefined || src[o] === null) return
    data.append(o, src[o])
  })
  return data
}

/**
 * 프로젝트 내부 API 요청
 * @param {object} options
 * @param {string} [options.url]
 * @return {Promise<any>}
 */
export async function localRequest({ url, ...rest })
{
  return await $fetch(url, {
    responseType: 'json',
    ...rest,
  })
}

/**
 * check forms
 * 모든 폼에 에러가 있는지 검사한다.
 * @param {object} src
 * @throws {Error}
 */
export function checkForms(src)
{
  Object.keys(src).forEach(key => {
    if (!!src[key].error) throw new Error(src[key].error)
  })
}
