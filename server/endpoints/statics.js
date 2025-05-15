import ServerError from '../extends/ServerError.js'
import { getContentType } from '../libs/string.js'
import { onRequest, onResponse, printMessage } from '../libs/server.js'

const { file } = Bun

/**
 * static
 * @params {Request} req
 * @params {DebugHTTPServer} ctx
 * @return {Promise<Response>}
 */
async function statics(req, ctx)
{
  let response
  onRequest(req, ctx)

  const url = new URL(req.url)
  const distPath = 'dist'

  // set file path
  let filePath = `${distPath}${url.pathname}`

  // check file path
  if (url.pathname === '/' || url.pathname.endsWith('/') || !(filePath.split('.').length > 1))
  {
    filePath = `${distPath}/index.html`
  }

  try
  {
    // set content
    const content = file(filePath)
    if (!(await content.exists()))
    {
      throw new ServerError('Not Found', {
        status: 404,
        statusText: 'File not found',
      })
    }

    // set extension
    const ext = filePath.split('.').pop().toLowerCase()

    // set content type
    const contentType = getContentType(ext)

    // set headers
    const headers = new Headers(req.headers)
    if (contentType) headers.set('Content-Type', contentType)

    // set response
    response = new Response(content, {
      headers,
    })
  }
  catch (e)
  {
    printMessage('error', `(${e.status || 500}) ${e.message}`)
    response = new Response(e.message, {
      status: e.status || 500,
      statusText: e.statusText || 'Internal Server Error',
    })
  }

  onResponse(req, response, ctx)
  return response
}

export default statics
