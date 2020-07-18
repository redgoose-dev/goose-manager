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
  mode: 'universal',
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
    indicator: false,
    filenames: {
      /**
       * TODO:
       * 2.13.x 버전에서 `/.nuxt/dist/client/commons/.efldf.js` 형태의 숨겨진 js 파일로 만들어진다.
       * https://github.com/nuxt/nuxt.js/issues/7703 이슈에서 잠시 대처할 수 있는 방법이 적혀있어 대처했다.
       * 2.14.x 버전에서 패치될 예정인걸로 보이므로(https://github.com/nuxt/nuxt.js/pull/7667) 버전이 오르면 이 코드는 삭제하고 다시 테스트 해봐야할 것이다.
       * 다음 코드는 자연스럽게 해결하는 방법이 아니기 때문에 나중에는 빼야할 것이다.
       */
      chunk: ({ isDev }) => isDev ? 'c[name].js' : 'c[id].[contenthash].js'
    },
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
};
