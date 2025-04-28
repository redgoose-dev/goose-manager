import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import { openServerMessage, isDev, staticOptions } from './libs/entry-assets.js'
import serviceServer from './index.js'

const __dirname = path.resolve()

// setup dotenv
dotenv.config({ path: [ '.env.local', '.env' ] })

async function server()
{
  const app = express()
  const dev = isDev()
  const env = process.env
  const outDir = env.VITE_OUT_DIR || 'dist'
  const clientPath = dev ? __dirname : path.resolve(outDir)

  // if (dev)
  // {
  //   process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
  // }

  // setup
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cookieParser())

  if (dev)
  {
    // # Development
    const { createServer } = await import('vite')
    // set vite
    const vite = await createServer({
      mode: dev ? 'development' : 'production',
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    })
    app.use(vite.middlewares)
    // extend routes
    serviceServer(app, env)
    // global route
    app.use('*', async (req, res) => {
      try
      {
        const url = req.originalUrl
        let template = fs.readFileSync(path.resolve(clientPath, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      }
      catch (e)
      {
        vite.ssrFixStacktrace(e)
        res.status(500).end(e.message)
      }
    })
  }
  else
  {
    // # Production
    // extend routes
    serviceServer(app, env)
    // global route
    app.use((req, res, next) => {
      if (req.path.indexOf('.') > -1)
      {
        // https://expressjs.com/en/5x/api.html#express.static
        app.use(env.VITE_BASE_URL, express.static(outDir, staticOptions))
        next()
      }
      else
      {
        let template = fs.readFileSync(path.resolve(clientPath, 'index.html'), 'utf-8')
        res
          .status(200)
          .set({ 'Content-Type': 'text/html' })
          .end(template)
      }
    })
  }

  // listen server
  app.listen(Number(env.VITE_PORT) || 80, env.VITE_HOST, () => {
    openServerMessage(env.VITE_HOST, Number(env.VITE_PORT) || 80, dev)
  })
}

// actions
server().then()
