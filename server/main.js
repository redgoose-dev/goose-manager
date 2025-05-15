import { isDev, openServerMessage } from './libs/server.js'
import statics from './endpoints/statics.js'
import onError from './endpoints/on-error.js'
import zoneCheckIn from './endpoints/zone/checkin.js'
import zoneCheckOut from './endpoints/zone/checkout.js'
import zoneReady from './endpoints/zone/ready.js'
import getPreference from './endpoints/zone/get-preference.js'
import updatePreference from './endpoints/zone/update-preference.js'
import login from './endpoints/zone/login.js'

const { serve } = Bun
const { VITE_HOST, VITE_PORT_SERVER } = Bun.env
const server = {
  host: VITE_HOST,
  port: Number(VITE_PORT_SERVER),
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
  ...(!server.dev ? { '/*': statics } : undefined),
}

// run server
serve({
  development: server.dev,
  port: server.port,
  hostname: server.host,
  routes,
  error: onError,
})

// open server message
openServerMessage(server.host, server.port, server.dev)
