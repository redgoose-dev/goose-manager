// state
export const state = () => ({
	url_api: '',
	authUser: null,
});


// actions
export const actions = {
	async nuxtServerInit(cox, box)
	{
		const { state, commit } = cox;
		const { req, app } = box;

		// setup
		if ((process && process.server) || box.isServer)
		{
			commit('setup', {
				url_app: box.env.APP_URL,
				url_api: box.env.APP_API_URL,
				authUser: (req.session && req.session.authUser) ? req.session.authUser : null,
			});
		}
	}
};


// mutations
export const mutations = {
	// setup app
	setup(state, value)
	{
		state.url_app = value.url_app;
		state.url_api = value.url_api;
		state.authUser = value.authUser;
	},

	// update auth user
	updateAuthUser(state, value)
	{
		state.authUser = value;
	},
};