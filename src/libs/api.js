/** @var {string} API_URL */

import axios from 'axios';
import store from '../store';

let instance;
let timer;

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
 * check forms
 * @param {object} src
 * @throws {Error}
 */
export function checkForms(src)
{
  Object.keys(src).forEach(key => {
    if (!!src[key].error) throw new Error(src[key].error);
  });
}

/**
 * get method
 * @param {string} url
 * @param {object} params
 * @param {object} options
 * @return {Promise<object>}
 */
export async function get(url, params = {}, options)
{
  if (!instance) setup();
  let res = await instance.get(url, { params }, options);
  res = res.data;
  checkStatus(res);
  if (res._token) refreshToken(res._token);
  return res;
}

/**
 * post method
 * @param {string} url
 * @param {any} data
 * @param {object} options
 * @return {Promise<object>}
 */
export async function post(url, data = null, options)
{
  if (!instance) setup();
  let res = await instance.post(url, data, options);
  res = res.data;
  checkStatus(res);
  if (res._token) refreshToken(res._token);
  return res;
}

/**
 * refresh token
 * @param {string} token
 */
function refreshToken(token)
{
  const delay = 2000;
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    let res = await axios.post('/local/refresh-token/', { token });
    if (res.data.token) store.state.token = res.data.token;
    timer = undefined;
  }, delay);
}
