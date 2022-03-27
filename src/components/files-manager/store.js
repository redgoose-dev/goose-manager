import { createStore } from 'vuex';

function initializeState()
{
  return {
    tab: 'global',
    post: {
      module: '',
      targetSrl: NaN,
      cropper: {},
      thumbnail: {},
      index: [],
      idx: 0,
      selected: [],
    },
    global: {
      path: 'assets',
      index: [],
      idx: 0,
      selected: [],
    },
    acceptFileType: 'image/*',
    fullSize: false,
    window: [],
  };
}

export default createStore({
  state: initializeState(),
  mutations: {
    initialize: (state, payload) => {
      state = initializeState();
    },
  },
  actions: {},
});
