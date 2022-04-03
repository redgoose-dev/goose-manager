import axios from 'axios';
import store from '../store';
import { setup } from './service';
import { getPath } from './string';

/** @var {string} BASE_URL */

/**
 * check auth
 * 매 화면으로 들어갈때마다 스토어와 쿠키를 검사하여 인증되었는지 검사한다.
 * @return {Promise<boolean>}
 * @throws {Error}
 */
export async function checkAuth()
{
  try
  {
    // check store
    if (store.state.token && store.state.user?.srl) return true;
    // request server for get cookie
    const res = await axios.post(getPath(`${BASE_URL}/local//auth//`));
    if (!res.data.success) throw new Error('failed auth');
    // setup service
    const { token, user } = res.data.data;
    await setup(token, user);
    return true;
  }
  catch (e)
  {
    return false;
  }
}

/**
 * logout
 * @return {Promise<void>}
 * @throws {Error}
 */
export async function logout()
{
  let res = await axios.post(getPath(`${BASE_URL}/local/logout/`));
  if (!res.data.success) throw new Error('Failed request');
  location.href = '/auth/login/';
}
