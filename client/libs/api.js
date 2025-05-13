import { $fetch } from 'ofetch'
import { authStore } from '../store/auth.js'

let instance = $fetch.create({
  retry: 0,
  responseType: 'json',
})
export let baseUrl = ''

/**
 * request api
 * @param {string} method
 * @param {string} url
 * @param {object} options
 * @return {Promise<object>}
 */
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
    if (e.lengthComputable)
    {
      onProgress(Math.floor((e.loaded / e.total) * 100 * 100) / 100)
    }
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

export function formData(src)
{
  if (!src) return null
  let data = new FormData()
  Object.keys(src).forEach(o => data.append(o, src[o]))
  return data
}

export async function localRequest({ url, ...rest })
{
  return await $fetch(url, {
    responseType: 'json',
    ...rest,
  })
}
