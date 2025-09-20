import { isDev, openServerMessage } from './libs/server.js'
import statics from './endpoints/statics.js'
import onError from './endpoints/on-error.js'
import zoneCheckIn from './endpoints/zone/checkin.js'
import zoneCheckOut from './endpoints/zone/checkout.js'
import zoneReady from './endpoints/zone/ready.js'
import getPreference from './endpoints/zone/get-preference.js'
import updatePreference from './endpoints/zone/update-preference.js'
import login from './endpoints/zone/login.js'
import renew from './endpoints/zone/renew.js'
import download from './endpoints/zone/download.js'

const { serve } = Bun
const { HOST, PORT } = Bun.env
const server = {
  host: HOST,
  port: Number(PORT),
  dev: isDev(),
}

// set routes
const routes = {
  '/zone/ready/': {
    POST: zoneReady,
  },
  '/zone/checkin/': {
    GET: zoneCheckIn,
    POST: zoneCheckIn,
  },
  '/zone/checkout/': {
    POST: zoneCheckOut,
  },
  '/zone/preference/': {
    POST: getPreference,
    PATCH: updatePreference,
  },
  '/zone/login/': {
    POST: login,
  },
  '/zone/renew/': {
    POST: renew,
  },
  '/zone/download/': {
    POST: download,
  },
  ...(!server.dev ? { '/*': statics } : undefined),
}

// run server
const _server = serve({
  development: server.dev,
  port: server.port,
  hostname: server.host,
  routes,
  error: onError,
})

// open server message
openServerMessage(_server.hostname, _server.port, _server.development)
