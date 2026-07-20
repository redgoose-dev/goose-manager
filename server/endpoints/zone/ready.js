import ServiceError from '../../extends/ServerError.js'
import * as api from '../../libs/api.js'
import { onRequest, onResponse, printMessage } from '../../libs/server.js'
import { isDev } from '../../libs/server.js'
import { getPreferenceData } from './get-preference.js'

const { URL_PATH } = Bun.env
const dev = isDev()

/**
 * checkin
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
async function ready(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    let _data = {}
    const res = await api.request('/auth/ready-login/', {
      method: 'post',
      body: { redirect_uri: URL_PATH + '/zone/checkin/' },
    })
    const { content } = res
    if (content.data?.length > 0)
    {
      _data.providers = content.data
    }
    // get preference
    const _preference = await getPreferenceData()
    _data.preference = {
      ..._preference.general,
      ..._preference.login,
    }
    // set response
    response = Response.json({
      message: 'Complete get ready login data.',
      data: _data,
    })
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    switch (e.code)
    {
      case 'ConnectionRefused':
        response = new Response('Service Unavailable', { status: 503 })
        break
      default:
        response = new Response('Failed get login ready data.', { status: e.status || 500 })
        break
    }
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  return response
}

export default ready
