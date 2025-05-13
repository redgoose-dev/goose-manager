import { colorText, dateFormat } from './string.js'

const { NODE_ENV, VITE_APP_TITLE } = Bun.env

/**
 * is development
 * @return {boolean}
 */
export function isDev()
{
  return NODE_ENV === 'development'
}

/**
 * open server message
 * @param {string} host
 * @param {number} port
 * @param {boolean} isDev
 */
export function openServerMessage(host, port, isDev)
{
  const assets = {
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    line: Array(40).fill('=').join(''),
    development: 'Development',
    production: 'Production',
    intent: Array(2).fill(' ').join(''),
  }
  let mode = ''
  if (isDev)
  {
    mode = colorText(`[${assets.development}]`, 'yellow')
  }
  else
  {
    mode = colorText(`[${assets.production}]`, 'blue')
  }
  console.log(assets.line)
  console.log(`${assets.intent}${colorText(VITE_APP_TITLE, 'green')} ${mode}`)
  console.log(`${assets.intent}➜ Local: ${colorText(`${host}:${port}`, 'cyan')}`)
  console.log(assets.line)
}

/**
 * print message
 * @param {'success'|'error'|'info'} mode
 * @param {string} message
 */
export function printMessage(mode = 'success', message)
{
  switch (mode)
  {
    case 'success':
      console.log(`✅ ${colorText(message, 'green')}`)
      break
    case 'error':
      console.error(`⚠️ ${colorText(message, 'red')}`)
      break
    case 'info':
      console.info(`📚 ${colorText(message, 'cyan')}`)
      break
  }
}

/**
 * on request
 * @param {Request} req
 * @param {DebugHTTPServer} ctx
 */
export function onRequest(req, ctx)
{
  const _url = new URL(req.url)
  const date = dateFormat(new Date(), '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}')
  const method = colorText(req.method, 'cyan')
  const url = colorText(_url.pathname, 'blue')
  console.group(`🪴 [${date}] ${method} ${url}`)
}

/**
 * on response
 * @param {Request} req
 * @param {Response} res
 * @param {DebugHTTPServer} ctx
 */
export function onResponse(req, res, ctx)
{
  console.groupEnd()
}

/**
 * get form data
 * @param {Request} req
 * @return {Promise<FormData>}
 */
export async function getFormData(req)
{
  try
  {
    return await req.formData()
  }
  catch (e)
  {
    return undefined
  }
}
