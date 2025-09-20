import ServiceError from '../../extends/ServerError.js'
import * as api from '../../libs/api.js'
import * as cookie from '../../libs/cookie.js'
import { onRequest, onResponse, printMessage, getFormData } from '../../libs/server.js'
import { getPreferenceData } from './get-preference.js'
import { isDev } from '../../libs/server.js'
import { defaultCookieExpires } from '../../libs/assets.js'

const { API_URL, API_CLIENT_URL, URL_PATH } = Bun.env
const dev = isDev()

/**
 * checkin
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
export default async function checkIn(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    // get request data
    const data = await getRequestData(req)

    // get access token
    const accessToken = data?.access || cookie.get(req, 'access')
    if (!accessToken)
    {
      throw new ServiceError('Not found access token.', {
        status: 401,
      })
    }

    // confirm goose-api
    let res
    try
    {
      res = await api.request('/auth/checking/', {
        method: 'post',
        headers: { 'Authorization': accessToken },
      })
    }
    catch (err)
    {
      if (err.status === 401)
      {
        const refreshToken = cookie.get(req, 'refresh')
        if (refreshToken)
        {
          res = await api.request('/auth/renew/', {
            method: 'post',
            headers: { 'Authorization': accessToken },
            body: { refresh: refreshToken },
          })
        }
      }
      else
      {
        throw new ServiceError(err.message, {
          status: err.status,
        })
      }
    }
    if (!res)
    {
      throw new ServiceError('Not found response.', { status: 500 })
    }
    const { status, content } = res
    if (status !== 200)
    {
      throw new ServiceError(content, { status })
    }
    if (!content?.data?.provider)
    {
      throw new ServiceError('Not found provider.', { status })
    }

    // save cookie
    if (data && data.access)
    {
      const _expires = Number(data.expires || defaultCookieExpires)
      cookie.save(req, 'access', data.access, _expires)
      if (data.refresh)
      {
        cookie.save(req, 'refresh', data.refresh, defaultCookieExpires)
      }
    }

    // get preference
    const preference = await getPreferenceData()

    // set response
    response = Response.json({
      message: 'Complete check in.',
      token: !data?.access ? accessToken : undefined,
      url: URL_PATH,
      apiUrl: API_CLIENT_URL || API_URL,
      provider: content.data.provider,
      preference,
    })
  }
  catch(e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response(e.response || 'Skipped check in.', {
      status: 202,
      statusText: e.message,
    })
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  if (req.method === 'GET')
  {
    return new Response(null, {
      status: 302,
      headers: { Location: URL_PATH },
    })
  }
  else
  {
    return response
  }
}

async function getRequestData(req)
{
  let result = {}
  switch (req.method)
  {
    case 'GET':
      const url = new URL(req.url)
      result = {
        access: url.searchParams.get('access'),
        expires: url.searchParams.get('expires'),
        refresh: url.searchParams.get('refresh'),
        errorCode: url.searchParams.get('error_code'),
      }
      break
    case 'POST':
      const _formData = await getFormData(req)
      if (!_formData) return undefined
      result = {
        access: _formData.get('access'),
        expires: _formData.get('expires'),
        refresh: _formData.get('refresh'),
      }
      break
  }
  if (Object.values(result).filter(Boolean).length > 0)
  {
    if (result.errorCode)
    {
      throw new ServiceError(`API Error "${result.errorCode}"`, {
        status: 401,
        response: 'Failed checkin.',
      })
    }
    if (!result.access)
    {
      throw new ServiceError('Required "access" value.', { status: 401 })
    }
    return result
  }
  else
  {
    return undefined
  }
}
