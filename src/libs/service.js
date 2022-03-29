import store from '../store';
import { setupPreference } from '../store/sub/preference';

/**
 * setup
 * @param {string} token
 * @param {object} user
 */
export async function setup(token, user)
{
  store.state.token = token;
  store.state.user = user;
  await setupPreference();
}

/**
 * destroy
 */
export function destroy()
{
  store.state.token = null;
  store.state.user = null;
}
