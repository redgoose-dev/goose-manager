import bodyParser from 'body-parser';
import session from 'express-session';
const MYSQLStore = require('express-mysql-session')(session);
import extendRoutes from './assets/routes';

// get .env
require('dotenv').config();

// set env values
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, APP_NAME, APP_API_URL, APP_SECRET_KEY } = process.env;
// set session store
const sessionStore = (DB_HOST && DB_PORT && DB_USERNAME && DB_PASSWORD && DB_DATABASE) ? new MYSQLStore({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  clearExpired: false,
}) : null;

// nuxt config
module.exports = {
  head: {
    title: APP_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'shortcut icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
    ],
  },
  css: [
    '~assets/scss/app.scss'
  ],
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv'
  ],
  plugins: [
    '~/plugins/axios',
    { src: '~/plugins/toast', ssr: false },
    { src: '~/plugins/croppie.js', ssr: false },
  ],
  axios: {
    baseURL: APP_API_URL,
  },
  loading: {
    color: '#1ccd5c',
    height: '2px',
  },
  router: {
    base: '/',
    middleware: [ 'hook' ],
    linkActiveClass: 'nuxt-active',
    extendRoutes(routes, resolve)
    {
      extendRoutes.forEach((route) => {
        routes.push({
          name: route.name,
          path: route.path,
          component: resolve(__dirname, route.component),
        });
      });
    },
  },
  serverMiddleware: [
    bodyParser.json(),
    session({
      key: 'session_cookie_name',
      secret: APP_SECRET_KEY,
      store: sessionStore || null,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 6, // ms * m * h * d
      }
    }),
    '~/api',
  ],
  telemetry: false,
};
