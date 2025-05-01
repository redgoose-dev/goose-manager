import ServiceError from '../../extends/ServerError.js'
import * as api from '../../libs/api.js'
import * as cookie from '../../libs/cookie.js'
import { onRequest, onResponse, printMessage } from '../../libs/server.js'

const { VITE_API_URL } = Bun.env

/**
 * setCookie
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
async function checkIn(req, ctx)
{
  let response
  onRequest(req, ctx)

  try
  {
    const data = await req.formData()

    // get access token
    let accessToken
    if (data.get('accessToken'))
    {
      accessToken = data.get('accessToken')
    }
    else
    {
      accessToken = cookie.get(req, 'access')
    }
    if (!accessToken)
    {
      throw new ServiceError('Not found access token.', {
        status: 400,
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
    if (!res) throw new ServiceError('Not found response.', { status: 500 })
    const { status, content } = res
    if (status !== 200) throw new ServiceError(content, { status })
    if (!content?.data?.provider) throw new ServiceError('Not found provider.', { status })

    // save cookie
    if (data.get('accessToken'))
    {
      cookie.save(
        req,
        'access',
        data.get('accessToken'),
        Number(data.get('expires') || 7 * 24 * 60 * 60 * 1000),
      )
      if (data.get('refreshToken'))
      {
        cookie.save(
          req,
          'refresh',
          data.get('refreshToken')
        )
      }
    }

    // set response
    response = Response.json({
      message: 'Complete check in.',
      provider: content.data.provider,
      apiUrl: VITE_API_URL,
    })
  }
  catch(e)
  {
    printMessage('error', `(${e.status || 500}) ${e.message}`)
    response = new Response('Skipped check in.', {
      status: 202,
      statusText: e.message,
    })
  }

  onResponse(req, response, ctx)
  return response || new Response('Skipped check-in.', { status: 202 })
}

export default checkIn
