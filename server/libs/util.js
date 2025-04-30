const { NODE_ENV } = Bun.env

/**
 * sleep (delay tool)
 * @param {number} [ms=1000]
 * @returns {Promise<unknown>}
 */
export function sleep(ms = 1000)
{
  return new Promise(resolve => setTimeout(resolve, ms))
}
