import { defaultPreference } from './sub/preference';
import { getFilters } from './sub/filters';
import { getHeader } from './sub/header';

/**
 * store
 * @exports store/state
 * @typedef Store
 *
 * @property {object} header
 * @property {string} token
 * @property {object} user
 * @property {object} preference
 * @property {object} filters
 */
export default {
  header: getHeader(),
  token: null,
  user: null,
  preference: defaultPreference(),
  filters: getFilters(),
};
