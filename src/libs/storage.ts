const prefix = STORAGE_PREFIX || 'goose'

/**
 * check localStorage
 */
function checkObject(): boolean
{
  return !!window.localStorage
}

/**
 * get value in localStorage
 */
export function get(key: string): any
{
  if (!(checkObject() && key)) return undefined
  try
  {
    return JSON.parse((window as any).localStorage.getItem(`${prefix}-${key}`))
  }
  catch(e)
  {
    return undefined
  }
}

/**
 * set value in localStorage
 */
export function set(key: string, value: any): void
{
  if (!(checkObject() && key && value)) return
  window.localStorage.setItem(`${prefix}-${key}`, JSON.stringify(value))
}
