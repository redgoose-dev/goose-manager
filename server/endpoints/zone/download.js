import { onRequest, onResponse, printMessage } from '../../libs/server.js'
import { isDev } from '../../libs/server.js'

const dev = isDev()

/**
 * download file
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
    if (!data.url) throw new Error('url is missing.')
    const res = await fetch(data.url)
    if (!res.ok) throw new Error(res.statusText)
    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await res.arrayBuffer()
    const size = arrayBuffer.byteLength
    let buffer
    if (contentType.includes('text') || contentType.includes('json'))
    {
      buffer = await res.text()
    }
    else
    {
      buffer = Buffer.from(arrayBuffer)
    }
    response = new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': size,
      },
    })
  }
  catch (e)
  {
    if (dev) printMessage('error', `[${e.status || 500}] ${e.message}`)
    response = new Response('Failed to download file.', { status: e.status || 500 })
  }

  // trigger response event
  onResponse(req, response, ctx)

  return response
}
