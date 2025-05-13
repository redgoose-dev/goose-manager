import ServiceError from '../extends/ServerError.js'
import ServiceResponse from '../extends/ServiceResponse.js'

const { VITE_API_URL } = Bun.env

export let assets = {
  headers: {},
}

/**
 * request
 * @param {string} path
 * @param {object} options
 * @return {Promise}
 */
export async function request(path, options = {})
{
  const { method, query, body, headers, responseType } = options
  // set assets
  let url = `${VITE_API_URL}${path}`
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
    verbose: false, // 자세한 요청과 응답을 보려면 사용하기
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
      return new ServiceResponse(res.status, result)
    case 'buffer':
      result = await res.arrayBuffer()
      return new ServiceResponse(res.status, result)
    case 'text':
      result = await res.text()
      return new ServiceResponse(res.status, result)
    case 'json':
    default:
      result = await res.json()
      return new ServiceResponse(res.status, result)
  }
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
