import { createStore } from 'vuex';
import state from './state';
import * as mutations from './mutations';
import * as actions from './actions';

export default createStore({
  state,
  mutations,
  actions,
});
