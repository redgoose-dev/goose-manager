import * as object from '~/libs/object';

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
  path_root: '/',
  path_static: '/',
  authUser: null,
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
        path_root: box.base.replace(/\/$/, ''),
        path_static: box.env.APP_STATIC_PATH.replace(/\/$/, ''),
        authUser: (req.session && req.session.authUser) ? req.session.authUser : null,
      };
      // get preference
      try
      {
        let pref = await app.$axios.$get(`${box.env.APP_URL}/api/preference-load/`);
        if (pref.success) setup.preference = pref.data;
      }
      catch(e) {
        console.error(e);
      }
      // commit
      commit('setup', setup);
    }
  },
  /**
   * update preference
   *
   * @param {object} context
   * @param {array|object} value
   */
  updatePreference(context, value)
  {
    const { preference, url_app } = context.state;
    let pref = object.convertRaw(preference);
    let arr = Array.isArray(value) ? value : [value];
    // set value in preference
    arr.forEach((o) => {
      pref = object.set(pref, o.key, o.value);
    });
    // update store
    context.commit('updatePreference', pref);
    // save preference
    try
    {
      this.$axios.$post(`${url_app}/api/preference-save/`, pref).then();
    }
    catch(e)
    {
      if (preference.debug.service) console.error(e);
    }
  },
};

// mutations - 단순히 상태값만 변경해주는 메서드
export const mutations = {
  // setup app
  setup(state, value)
  {
    const keys = Object.keys(value);
    for (let i=0; i<keys.length; i++)
    {
      state[keys[i]] = value[keys[i]];
    }
  },
  // update preference
  updatePreference(state, value)
  {
    state.preference = value;
  },
};

// strict
export const strict = false;
