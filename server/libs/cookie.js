const { COOKIE_PREFIX, COOKIE_DOMAIN, COOKIE_HTTPONLY, COOKIE_PATH } = Bun.env

/**
 * get key name
 * @param {string} key
 * @return {string}
 */
function getKeyName(key)
{
  return `${COOKIE_PREFIX}__${key}`
}

/**
 * save cookie
 * @param {Request} req
 * @param {string} key
 * @param {string} value
 * @param {number} expires
 */
export function save(req, key, value, expires = undefined)
{
  const { cookies } = req
  if (!cookies) throw new Error('cookies not found.')
  const _url = new URL(req.url)
  const maxAge = expires ? Number(expires) : 14 * 24 * 60 * 60 * 1000 // 14 days
  cookies.set(getKeyName(key), value, {
    domain: COOKIE_DOMAIN,
    path: COOKIE_PATH,
    maxAge,
    httpOnly: COOKIE_HTTPONLY.toLowerCase() === 'true',
    secure: _url.protocol === 'https:',
  })
}

/**
 * get cookie
 * @param {Request} req
 * @param {string} key
 * @return {string}
 */
export function get(req, key)
{
  const { cookies } = req
  if (!cookies) throw new Error('cookies not found.')
  return cookies.get(getKeyName(key))
}

/**
 * remove cookie
 * @param {Request} req
 * @param {string} key
 */
export function remove(req, key)
{
  const { cookies } = req
  if (!cookies) throw new Error('cookies not found.')
  cookies.delete({
    name: getKeyName(key),
    domain: COOKIE_DOMAIN,
    path: COOKIE_PATH,
  })
}
