// state
export const state = () => ({
	authUser: null,
});


// actions
export const actions = {
	async nuxtServerInit(cox, box)
	{
		const { state, commit } = cox;
		const { req, app } = box;

		if (req.session && req.session.authUser) {
			commit('setUser', req.session.authUser)
		}
	}
};


// mutations
export const mutations = {
	// set user
	setUser (state, user)
	{
		state.authUser = user;
	},
};