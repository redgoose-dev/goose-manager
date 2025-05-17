import ServiceError from '../../extends/ServerError.js'
import * as api from '../../libs/api.js'
import * as cookie from '../../libs/cookie.js'
import { onRequest, onResponse, printMessage } from '../../libs/server.js'
import { isDev } from '../../libs/server.js'
import { defaultCookieExpires } from '../../libs/assets.js'

const dev = isDev()

export default async function renew(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    // get access token and checking
    const accessToken = api.getAuthorization(req)
    if (!accessToken)
    {
      throw new ServiceError('Not found access token.', { status: 401 })
    }
    const accessTokenInCookie = cookie.get(req, 'access')
    if (accessToken !== accessTokenInCookie)
    {
      throw new ServiceError('Mismatch access token and access token in cookie.', { status: 401 })
    }

    // get refresh token
    const refreshToken = cookie.get(req, 'refresh')

    // request api
    const res = await api.request('/auth/renew/', {
      method: 'post',
      headers: { 'Authorization': accessToken },
      body: { 'refresh': refreshToken },
    })
    if (!res?.content?.data?.access)
    {
      throw new ServiceError('Not found data in response.', { status: res.status || 500 })
    }

    // save cookie
    const { access, expires, refresh } = res.content.data
    const _expires = Number(expires || defaultCookieExpires)
    cookie.save(req, 'access', access, _expires)
    if (refresh)
    {
      cookie.save(req, 'refresh', refresh, defaultCookieExpires)
    }

    // set response
    response = Response.json({
      message: 'Complete renewed token.',
      token: access,
    })
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status}] ${e.message}`)
    // delete cookies
    cookie.remove(req, 'access')
    cookie.remove(req, 'refresh')
    // set response
    response = new Response('Failed renewal token.', { status: e.status || 500 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  return response
}
