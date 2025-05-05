/**
 * sleep (delay tool)
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms))
}
