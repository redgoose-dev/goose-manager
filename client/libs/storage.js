const prefix = 'manager'

/**
 * set storage data
 * @param {string} key
 * @param {object|array} value
 */
export function set(key, value)
{
  window.localStorage.setItem(`${prefix}-${key}`, JSON.stringify(value))
}

/**
 * get storage data
 * @param {string} key
 * @return {object|array}
 */
export function get(key)
{
  try
  {
    const text = window.localStorage.getItem(`${prefix}-${key}`)
    return JSON.parse(text || '')
  }
  catch (_e)
  {
    return undefined
  }
}
