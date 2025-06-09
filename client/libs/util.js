/**
 * sleep (delay tool)
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @param {number} y
 */
export function scrollTo(y = 0)
{
  window.scroll(0, y)
}
