import { getPreference } from '../preference';

/**
 * store
 * @exports store/state
 * @typedef Store
 *
 * @property {string} token
 */
export default {
  token: null,
  user: null,
  preference: getPreference(),
};
