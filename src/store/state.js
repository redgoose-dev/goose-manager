import { getPreference } from '../preference';
import { getFilters } from './sub/filters';

/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
/** @var {string} SHORT_NAME */

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
  header: {
    title: TITLE || 'Goose Manager',
    description: DESCRIPTION || '',
    shortName: SHORT_NAME || 'GOOSE',
  },
  token: null,
  user: null,
  preference: getPreference(),
  filters: getFilters(),
};
