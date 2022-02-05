import store from '../store';

/**
 * setup
 * @param {string} token
 * @param {object} user
 */
export function setup(token, user)
{
  store.state.token = token;
  store.state.user = user;
}

/**
 * destroy
 */
export function destroy()
{
  store.state.token = null;
  store.state.user = null;
}
