// state
export const state = () => ({
	url_api: '',
	authUser: null,
});


// actions - 비동기가 가능한 상태관리 메서드라고 볼 수 있음
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


// mutations - 단순히 상태값만 변경해주는 메서드
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