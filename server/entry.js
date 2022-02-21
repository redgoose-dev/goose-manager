import fs from 'fs';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer, loadEnv } from 'vite';
import { openServerMessage, isDev } from './libs/entry-assets.js';
import serviceServer from './index.js';

const __dirname = path.resolve();

async function server()
{
  const app = express();
  const dev = isDev();
  const env = loadEnv(dev ? 'development' : 'production', __dirname);
  const outDir = env.VITE_OUT_DIR || 'dist';
  const clientPath = dev ? __dirname : path.resolve(outDir);

  // setup
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  if (dev)
  {
    // # Development
    // set vite
    const vite = await createServer({
      mode: dev ? 'development' : 'production',
      server: { middlewareMode: 'ssr' },
    });
    app.use(vite.middlewares);
    // extend routes
    serviceServer(app, env);
    // global route
    app.use('*', async (req, res) => {
      try
      {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(clientPath, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      }
      catch (e)
      {
        vite.ssrFixStacktrace(e);
        res.status(500).end(e.message);
      }
    });
  }
  else
  {
    // # Production
    // extend routes
    serviceServer(app, env);
    // global route
    app.use((req, res, next) => {
      if (req.path.indexOf('.') > -1)
      {
        app.use(express.static(outDir, {
          // https://expressjs.com/en/5x/api.html#express.static
        }));
        next();
      }
      else
      {
        let template = fs.readFileSync(path.resolve(clientPath, 'index.html'), 'utf-8');
        res
          .status(200)
          .set({ 'Content-Type': 'text/html' })
          .end(template);
      }
    });
  }

  // listen server
  app.listen(Number(env.VITE_PORT) || 3000, env.VITE_HOST, () => {
    openServerMessage(env.VITE_HOST, Number(env.VITE_PORT) || 3000, dev);
  });
}

// actions
server().then();
