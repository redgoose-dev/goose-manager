
module.exports = {

	head: {
		title: 'Goose manager',
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
	],

	plugins: [
		'~/plugins/axios',
	],

	axios: {
		baseURL: '',
	},

	loading: {
		color: '#2e9ad1',
	},

	router: {
		base: '/',
		middleware: ['hook'],
		linkActiveClass: 'nuxt-active',
	},

};