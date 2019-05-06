const bodyParser = require('body-parser');
const session = require('express-session');
const MYSQLStore = require('express-mysql-session')(session);
// get .env
require('dotenv').config();
// set env values
const {
	DB_HOST,
	DB_PORT,
	DB_USERNAME,
	DB_PASSWORD,
	DB_DATABASE,
	APP_NAME,
	APP_API_URL,
	APP_SECRET_KEY,
} = process.env;
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
		extractCSS: true,
	},

	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/dotenv'
	],

	plugins: [
		'~/plugins/axios',
		{ src: '~/plugins/toast', ssr: false },
	],

	axios: {
		baseURL: APP_API_URL,
	},

	loading: {
		color: '#3883d1',
	},

	router: {
		base: '/',
		middleware: [ 'hook' ],
		linkActiveClass: 'nuxt-active',
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

	hooks: {
		build: {
			done(builder) {
				/**
				 * TODO:
				 * 빌드 끝나면 경고뜨는데 node를 종료함으로써 대처할 수 있습니다.
				 * 다음 코드는 잠시 대처용이고, `nuxt`에서 해결할 수 있을것으로 보입니다.
				 * https://github.com/nuxt/nuxt.js/issues/5067
				 */
				if (!builder.nuxt.options.dev) {
					setTimeout(() => process.exit(0), 1000);
				}
			}
		},
	},
};