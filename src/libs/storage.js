const prefix = STORAGE_PREFIX || 'goose'

/**
 * check localStorage
 */
function checkObject()
{
  return !!window.localStorage
}

/**
 * get value in localStorage
 */
export function get(key)
{
  if (!(checkObject() && key)) return undefined
  try
  {
    return JSON.parse(window.localStorage.getItem(`${prefix}-${key}`))
  }
  catch(e)
  {
    return undefined
  }
}

/**
 * set value in localStorage
 */
export function set(key, value)
{
  if (!(checkObject() && key && value)) return
  window.localStorage.setItem(`${prefix}-${key}`, JSON.stringify(value))
}
