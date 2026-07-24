const { COOKIE_REFRESH_EXPIRES } = Bun.env

export const defaultCookieExpires = 60 * 60 * 24 * Number(COOKIE_REFRESH_EXPIRES)
