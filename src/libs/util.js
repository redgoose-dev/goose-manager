/**
 * sleep (delay tool)
 * @param {number} ms
 * @return {Promise<void>}
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}
