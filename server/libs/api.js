import ServiceError from '../extends/ServerError.js'
import ServiceResponse from '../extends/ServiceResponse.js'

const { API_URL } = Bun.env

/**
 * get the client IP forwarded by the reverse proxy
 *
 * The public server is reached through a reverse proxy, which puts the
 * original client address in X-Forwarded-For. goose-api uses the first
 * address in that header when it records request.client_ip. Fall back to the
 * other proxy headers used by the supported deployments.
 *
 * @param {Request|undefined} request
 * @return {string|undefined}
 */
function getClientIp(request)
{
  if (!request?.headers) return undefined

  const forwarded = request.headers.get('x-forwarded-for')
  const forwardedIp = forwarded?.split(',')[0]?.trim()
  if (forwardedIp) return forwardedIp

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const cloudflareIp = request.headers.get('cf-connecting-ip')?.trim()
  return cloudflareIp || undefined
}

/**
 * make headers for the upstream API request
 * @param {Request|undefined} request
 * @return {Record<string, string>}
 */
function getClientIpHeaders(request)
{
  const clientIp = getClientIp(request)
  if (!clientIp) return {}

  return {
    'X-Forwarded-For': clientIp,
    'X-Real-IP': clientIp,
  }
}

export let assets = {
  headers: {},
}

/**
 * request
 * @param {string} path
 * @param {object} options
 * @param {Request} options.request 원 요청
 * @param {boolean} debug 디버그 모드
 * @return {Promise}
 */
export async function request(path, options = {}, debug = false)
{
  const { method, query, body, headers, responseType, request } = options
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
      ...getClientIpHeaders(request),
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
