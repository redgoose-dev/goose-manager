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
    const res = await api.request('/auth/ready-login/', {
      method: 'post',
      body: { redirect_uri: URL_PATH + '/zone/checkin/' },
    })
    const { content } = res
    if (!content.data?.providers?.length > 0)
    {
      throw new Error('Not found data.')
    }
    // get preference
    const preference = await getPreferenceData()
    // set response
    response = Response.json({
      message: 'Complete get ready login data.',
      data: {
        providers: content.data.providers,
        preference: {
          ...preference.general,
          ...preference.login,
        },
      },
    })
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response('Failed get login ready data.', { status: e.status || 500 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  return response
}

export default ready
