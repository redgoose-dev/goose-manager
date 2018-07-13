// state
export const state = () => ({
	user: {
		srl: null,
		email: null,
		name: null,
		level: null,
	},
});


// action
export const actions = {
	async nuxtServerInit(cox, box)
	{
		// TODO: 쿠키에 토큰이 들어있으면 api 요청으로 decode하고 user 데이터 업데이트 한다.
		// TODO: 아니면 로그인할때 미리
		return {};
	}
};


// mutations
export const mutations = {
	/**
	 * update user
	 */
	updateUser (state, value=null)
	{
		state = {
			...state.user,
			...value
		};
	},
};