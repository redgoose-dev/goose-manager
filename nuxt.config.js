import bodyParser from 'body-parser';
import session from 'express-session';
const MYSQLStore = require('express-mysql-session')(session);
import extendRoutes from './assets/routes';

// get .env
require('dotenv').config();
const env = process.env;
const staticPath = env.APP_STATIC_PATH.replace(/\/$/, '');

// set session store
const sessionStore = (env.APP_DB_HOST && env.APP_DB_PORT && env.APP_DB_USERNAME && env.APP_DB_PASSWORD && env.APP_DB_DATABASE) ? new MYSQLStore({ host: env.APP_DB_HOST, port: env.APP_DB_PORT, user: env.APP_DB_USERNAME, password: env.APP_DB_PASSWORD, database: env.APP_DB_DATABASE, clearExpired: false }) : null;

// nuxt config
module.exports = {
  ssr: true,
  head: {
    title: env.APP_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'shortcut icon', href: `${staticPath}/favicon.ico` },
      { rel: 'icon', type: 'image/x-icon', href: `${staticPath}/icon.png` },
    ],
  },
  css: [
    '~assets/scss/app.scss'
  ],
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
    indicator: false,
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
    baseURL: env.APP_API_URL,
  },
  loading: {
    color: '#1ccd5c',
    height: '2px',
  },
  router: {
    base: env.APP_ROUTER_PATH,
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
  server: {
    host: process.env.HOST || process.env.APP_HOST || 'localhost',
    port: process.env.PORT || process.env.APP_PORT || 3000,
    timing: false,
  },
  serverMiddleware: [
    bodyParser.json(),
    session({
      key: 'session_cookie_name',
      secret: env.APP_SECRET_KEY,
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
