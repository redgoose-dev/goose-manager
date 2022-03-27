/** @var {string} STORAGE_PREFIX */

const prefix = STORAGE_PREFIX || 'goose';

/**
 * check localStorage
 *
 * @return {boolean}
 */
function checkObject()
{
  return !!window.localStorage;
}

/**
 * get value in localStorage
 *
 * @param {string} key
 * @returns {object}
 */
export function get(key)
{
  if (!(checkObject() && key)) return undefined;
  try
  {
    return JSON.parse(window.localStorage.getItem(`${prefix}-${key}`));
  }
  catch(e)
  {
    return undefined;
  }
}

/**
 * set value in localStorage
 *
 * @param {string} key
 * @param {any} value
 */
export function set(key, value)
{
  if (!(checkObject() && key && value)) return;
  window.localStorage.setItem(`${prefix}-${key}`, JSON.stringify(value));
}
