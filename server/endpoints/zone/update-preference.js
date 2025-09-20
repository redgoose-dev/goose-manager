import { onRequest, onResponse, printMessage } from '../../libs/server.js'
import { isDev } from '../../libs/server.js'
import { getPreferenceData } from './get-preference.js'

const { DATA_PATH } = Bun.env
const dev = isDev()
const path = `${DATA_PATH}/preference.json`

/**
 * update preference
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
export default async function updatePreference(req, ctx)
{
  let response

  // trigger request event
  onRequest(req, ctx)

  try
  {
    const data = await req.json()
    const originalData = await getPreferenceData()
    const merged = {
      ...originalData,
      ...data,
    }
    await Bun.write(path, JSON.stringify(merged, null, 2))
    response = new Response('Successfully updated preference.')
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response('Failed to update preference.', { status: e.status || 500 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  return response
}
