// get default preference
let defaultPreference = {};
try {
  defaultPreference = require('../preference');
}
catch(e)
{
  defaultPreference = require('../resource/preference');
}


// state
export const state = () => ({
  url_api: '',
  authUser: null,
  appName: 'Goose Manager',
  preference: defaultPreference,
});


// actions - 비동기가 가능한 상태관리 메서드라고 볼 수 있음
export const actions = {
  async nuxtServerInit(cox, box)
  {
    const { state, commit } = cox;
    const { req, app } = box;

    if ((process && process.server) || box.isServer)
    {
      let setup = {
        url_app: box.env.APP_URL,
        url_api: box.env.APP_API_URL,
        authUser: (req.session && req.session.authUser) ? req.session.authUser : null,
      };

      // get preference
      try
      {
        let pref = await app.$axios.$get(`${box.env.APP_URL}/api/preference-load/`);
        if (pref.success) setup.preference = pref.data;
      }
      catch(e) {}

      commit('setup', setup);
    }
  },
};


// mutations - 단순히 상태값만 변경해주는 메서드
export const mutations = {
  // setup app
  setup(state, value)
  {
    state.url_app = value.url_app;
    state.url_api = value.url_api;
    state.authUser = value.authUser;
    state.preference = value.preference;
  },

  // update auth user
  updateAuthUser(state, value)
  {
    state.authUser = value;
  },
};
