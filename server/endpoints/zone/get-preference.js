import { onRequest, onResponse, printMessage } from '../../libs/server.js'
import { isDev } from '../../libs/server.js'

const { VITE_BASE_PATH } = Bun.env
const dev = isDev()
const path = `${VITE_BASE_PATH}/data/preference.json`

/**
 * get preference
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
export default async function getPreference(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    const preference = await getPreferenceData()
    response = Response.json({
      message: 'get preference',
      data: preference,
    })
  }
  catch(e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response('Error get preference.', { status: 500 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  // return response
  return response
}

/**
 * get preference data
 * @return {Promise<object>}
 */
export async function getPreferenceData()
{
  const file = Bun.file(path)
  if (await file.exists())
  {
    return await file.json()
  }
  else
  {
    const { defaultPreference } = await import('../../libs/defaults.js')
    await Bun.write(path, JSON.stringify(defaultPreference, null, 2))
    return defaultPreference
  }
}
