import ServiceError from '../../extends/ServerError.js'
import * as api from '../../libs/api.js'
import * as cookie from '../../libs/cookie.js'
import { onRequest, onResponse, printMessage } from '../../libs/server.js'
import { isDev } from '../../libs/server.js'

const dev = isDev()

/**
 * setCookie
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
export default async function checkOut(req, ctx)
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
    if (!accessTokenInCookie)
    {
      throw new ServiceError('Not found accessTokenInCookie.', { status: 401 })
    }
    if (accessToken !== accessTokenInCookie)
    {
      throw new ServiceError('Mismatch accessToken and accessTokenInCookie.', { status: 401 })
    }

    // call logout api
    api.request('/auth/logout/', {
      method: 'post',
      headers: { 'Authorization': accessToken },
    }).catch(() => {})

    // delete cookies
    cookie.remove(req, 'access')
    cookie.remove(req, 'refresh')

    // set response
    response = new Response('Complete check out.')
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status}] ${e.message}`)
    response = new Response('Failed check out.', {
      status: e.status,
      statusText: e.message,
    })
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  return response
}
