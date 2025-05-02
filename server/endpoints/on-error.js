import { printMessage } from '../libs/server.js'

function onError(err)
{
  printMessage('error', err?.stack || err)
  return new Response(`Internal Error: ${err.message}`, {
    status: 500,
    headers: { 'Content-Type': 'text/plain' },
  })
}

export default onError
