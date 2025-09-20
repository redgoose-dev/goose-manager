import ServiceError from '../extends/ServerError.js'
import ServiceResponse from '../extends/ServiceResponse.js'

const { API_URL } = Bun.env

export let assets = {
  headers: {},
}

/**
 * request
 * @param {string} path
 * @param {object} options
 * @param {boolean} debug 디버그 모드
 * @return {Promise}
 */
export async function request(path, options = {}, debug = false)
{
  const { method, query, body, headers, responseType } = options
  // set assets
  let url = `${API_URL}${path}`
  if (query)
  {
    const params = new URLSearchParams(query)
    url += `?${params}`
  }
  let op = {
    method: method || 'get',
    headers: {
      ...assets.headers,
      ...headers,
    },
    verbose: debug,
  }
  if (body) op.body = formData(body)
  // request
  const res = await fetch(url, op)
  if (!res.ok)
  {
    throw new ServiceError(res.statusText, {
      status: res.status,
    })
  }
  // parsing response
  let result
  switch (responseType)
  {
    case 'blob':
      result = await res.blob()
      break
    case 'buffer':
      result = await res.arrayBuffer()
      break
    case 'text':
      result = await res.text()
      break
    case 'json':
    default:
      result = await res.json()
      break
  }
  return new ServiceResponse(res.status, result)
}

/**
 * get authorization
 * @param {Request} req
 * @return {string}
 */
export function getAuthorization(req)
{
  return req.headers.get('authorization') || ''
}

/**
 * form data
 * @param {object} src
 * @return {FormData}
 */
function formData(src)
{
  if (!src) return null
  let data = new FormData()
  Object.keys(src).forEach(o => data.append(o, src[o]))
  return data
}
