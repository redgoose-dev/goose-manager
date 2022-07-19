import { $fetch } from 'ohmyfetch'
import { Router } from 'express'

let cookie, app, env, api

/**
 * local routes
 */
function localRoutes()
{
  const router = Router()

  // auth
  router.post('/auth/', async (req, res) => {
    try
    {
      let token = req.cookies[cookie.prefix + '-token']
      let user = req.cookies[cookie.prefix + '-user']
      user = JSON.parse(user)
      if (!user.srl) throw new Error('Invalid user data')
      res.json({
        success: true,
        data: { token, user },
      })
    }
    catch(e)
    {
      res.json({
        success: false,
        message: 'Failed authorization.',
      })
    }
  })

  // login
  router.post('/login/', async (req, res) => {
    try
    {
      const { email, password, save } = req.body
      // request to api
      const { success, message, data } = await api('/auth/login/', {
        method: 'post',
        body: {
          email,
          password,
        },
      })
      // check response values
      if (!(success && !!data)) throw new Error(message)
      let user = data
      let token = user.token
      delete user.token
      delete user.host
      // set cookie
      if (save)
      {
        res.cookie(cookie.prefix + '-token', token, cookie.options)
        res.cookie(cookie.prefix + '-user', JSON.stringify(user, null, ''), cookie.options)
      }
      // result
      res.json({
        success: true,
        data: { user, token },
      })
    }
    catch (e)
    {
      res.json({
        success: false,
        message: e.message || 'Failed login',
      })
    }
  })

  // logout
  router.post('/logout/', async (req, res) => {
    res.clearCookie(cookie.prefix + '-token')
    res.clearCookie(cookie.prefix + '-user')
    res.json({ success: true })
  })

  // refresh token
  router.post('/refresh-token/', async (req, res) => {
    const { token } = req.body
    if (!token) return
    res.cookie(cookie.prefix + '-token', token, cookie.options)
    res.json({ token })
  })

  // TODO: 로그를 기록하는 기능 만들기

  return router
}

/**
 * setup
 *
 * @param {Express} _app
 * @param {object} _env
 */
function setup(_app, _env)
{
  app = _app
  env = _env
  const { VITE_COOKIE_PREFIX, VITE_COOKIE_EXPIRY, VITE_TOKEN_PUBLIC, VITE_API_URL } = env
  // set cookie assets
  cookie = {
    prefix: VITE_COOKIE_PREFIX,
    options: {
      maxAge: 1000 * 60 * 60 * 24 * Number(VITE_COOKIE_EXPIRY),
      httpOnly: true,
      secure: true,
      path: '/',
    }
  }
  // set api instance
  api = $fetch.create({
    baseURL: VITE_API_URL,
    retry: 0,
    responseType: 'json',
    headers: { 'Authorization': `Bearer ${VITE_TOKEN_PUBLIC}` },
  })
}

/**
 * server
 *
 * @param {Express} _app
 * @param {object} _env
 */
function server(_app, _env)
{
  setup(_app, _env)
  // set local routes
  let path = `${env.VITE_BASE_URL}/local/`
  path = path.replace(/\/\//gi, '/')
  app.use(path, localRoutes())
}

export default server
