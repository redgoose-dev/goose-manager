import bodyParser from 'body-parser';
import session from 'express-session';
const MYSQLStore = require('express-mysql-session')(session);
import extendRoutes from './assets/routes';

// get .env
require('dotenv').config();
const env = process.env;
const staticPath = env.APP_STATIC_PATH.replace(/\/$/, '');

// set session store
const sessionStore = (env.DB_HOST && env.DB_PORT && env.DB_USERNAME && env.DB_PASSWORD && env.DB_DATABASE) ? new MYSQLStore({ host: env.DB_HOST, port: env.DB_PORT, user: env.DB_USERNAME, password: env.DB_PASSWORD, database: env.DB_DATABASE, clearExpired: false }) : null;

// nuxt config
module.exports = {
  mode: 'universal',
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
};
