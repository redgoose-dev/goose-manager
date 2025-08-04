import ServiceError from '../../extends/ServerError.js'
import * as api from '../../libs/api.js'
import * as cookie from '../../libs/cookie.js'
import { onRequest, onResponse, printMessage } from '../../libs/server.js'
import { getPreferenceData } from './get-preference.js'
import { isDev } from '../../libs/server.js'
import { defaultCookieExpires } from '../../libs/assets.js'

const { VITE_API_URL, VITE_API_CLIENT_URL, VITE_URL_PATH } = Bun.env
const dev = isDev()

/**
 * login
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
export default async function login(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    const data = await req.json()

    // check body data
    if (!(data.id && data.password))
    {
      throw new ServiceError('id or password is missing.', { status: 400 })
    }

    // request to goose-api
    const res = await api.request('/auth/login/', {
      method: 'post',
      body: {
        id: data.id,
        password: data.password,
      },
    })
    const { status, content } = res
    if (status !== 200 || !content?.data?.access)
    {
      throw new ServiceError('Not found response from API.', { status: 401 })
    }
    const { access, expires, refresh } = content.data

    // checking
    const checkingResponse = await api.request('/auth/checking/', {
      headers: { 'Authorization': access },
      method: 'post',
    })
    const _provider = checkingResponse?.content?.data?.provider
    if (!_provider)
    {
      throw new ServiceError('No provider from API.', { status: 400 })
    }

    // save cookie
    const _expires = data.save ? Number(expires || 7 * 24 * 60 * 60 * 1000) : undefined
    cookie.save(req, 'access', access, _expires)
    if (refresh && data.save)
    {
      cookie.save(req, 'refresh', refresh, defaultCookieExpires)
    }

    // get preference
    const preference = await getPreferenceData()

    // set response
    response = Response.json({
      message: 'Login successful',
      token: content.data.access,
      url: VITE_URL_PATH,
      apiUrl: VITE_API_CLIENT_URL || VITE_API_URL,
      provider: _provider,
      preference,
    })
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response('Failed login', { status: e.status || 401 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  return response
}
