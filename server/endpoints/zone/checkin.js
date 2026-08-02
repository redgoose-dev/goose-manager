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

    // get access and refresh token
    const accessToken = data?.access || cookie.get(req, 'access')
    const refreshToken = data?.refresh || cookie.get(req, 'refresh')
    let currentAccessToken = accessToken
    let renewed = false

    // confirm goose-api
    let res
    if (currentAccessToken)
    {
      try
      {
        res = await api.request('/auth/checkin/', {
          request: req,
          method: 'post',
          headers: { 'Authorization': currentAccessToken },
        })
      }
      catch (err)
      {
        if (err.status !== 401)
        {
          throw new ServiceError(err.message, { status: err.status })
        }
      }
    }

    // access token이 없거나 만료된 경우 refresh token만으로 재발급
    if (!res)
    {
      if (!refreshToken)
      {
        throw new ServiceError('Not found refresh token.', { status: 401 })
      }
      const renewedResponse = await api.request('/auth/renew/', {
        request: req,
        method: 'post',
        body: { refresh: refreshToken },
      })
      const renewedData = renewedResponse?.content?.data
      if (!renewedData?.access)
      {
        throw new ServiceError('Not found renewed access token.', {
          status: renewedResponse.status || 500,
        })
      }
      currentAccessToken = renewedData.access
      renewed = true
      const _expires = Number(renewedData.expires || defaultCookieExpires)
      cookie.save(req, 'access', currentAccessToken, _expires)
      if (renewedData.refresh)
      {
        cookie.save(req, 'refresh', renewedData.refresh, defaultCookieExpires)
      }
      res = await api.request('/auth/checkin/', {
        request: req,
        method: 'post',
        headers: { 'Authorization': currentAccessToken },
      })
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
    if (data?.access && !renewed)
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
      token: !data?.access ? currentAccessToken : undefined,
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
