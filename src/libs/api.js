/** @var {string} API_URL */

import axios from 'axios';
import store from '../store';

let instance;

/**
 * setup
 */
function setup()
{
  instance = axios.create({
    baseURL: API_URL,
    timeout: 3000,
    headers: {
      'Authorization': `Bearer ${store.state.token}`,
    },
  });
}

/**
 * check status
 * @param {object} src
 * @throws {Error}
 */
function checkStatus(src)
{
  if (!src.success) throw new Error(src.message || 'An unknown error has occurred.');
}

/**
 * convert to FormData
 * @param {object} src
 * @return {object}
 */
export function formData(src)
{
  if (!src) return null;
  let data = new FormData();
  Object.keys(src).forEach(o => data.append(o, src[o]));
  return data;
}

/**
 * get method
 * @param {string} url
 * @param {object} params
 * @return {Promise<object>}
 */
export async function get(url, params = {})
{
  if (!instance) setup();
  let res = await instance.get(url, { params });
  res = res.data;
  checkStatus(res);
  // TODO: `res._token`값이 존재하면 리프레시 토큰이라고 인식하고 업데이트 해줘야할거같다.
  return res;
}

/**
 * post method
 * @param {string} url
 * @param {any} data
 * @return {Promise<object>}
 */
export async function post(url, data)
{
  if (!instance) setup();
  let res = await instance.post(url, data);
  res = res.data;
  checkStatus(res);
  // TODO: `res._token`값이 존재하면 리프레시 토큰이라고 인식하고 업데이트 해줘야할거같다.
  return res;
}
