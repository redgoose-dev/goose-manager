import { getPreference } from '../preference';

/** @var {string} TITLE */
/** @var {string} DESCRIPTION */
/** @var {string} SHORT_NAME */

/**
 * store
 * @exports store/state
 * @typedef Store
 *
 * @property {string} token
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
};
