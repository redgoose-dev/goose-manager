import { $fetch } from 'ohmyfetch'
import { Router } from 'express'
import { filteringHostname } from './libs/api.js'

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
      const _res = await api('/auth/login/', {
        method: 'post',
        body: {
          email,
          password,
        },
      })
      const { success, message, data } = _res
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
    let token = req.cookies[cookie.prefix + '-token'] || undefined
    if (token)
    {
      try
      {
        const _res = await api('/auth/logout/', {
          method: 'post',
          headers: { 'Authorization': `Bearer ${token}` },
        })
      }
      catch (_) {}
    }
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
 * service api routes
 */
function apiRoutes()
{
  const router = Router()

  // TODO: 프록시 기능에 대하여 테스트 (파일 첨부에 대하여 막혔다)
  // TODO: `multer`라는 모듈을 꼭 써줘야 할거같아 보인다.

  function errorHandler(msg)
  {
    let _err = {}
    switch (msg)
    {
      case 'NO-TOKEN':
        _err.code = 403
        _err.message = 'Failed authorization.'
        break
      default:
        _err.code = 500
        _err.message = 'Unknown error'
        break
    }
    return _err
  }

  router.get('*', async (req, res, next) => {
    try
    {
      let token = req.cookies[cookie.prefix + '-token'] || undefined
      if (!token) throw new Error('NO-TOKEN')
      const _res = await api(req.path, {
        method: 'get',
        headers: { 'Authorization': `Bearer ${token}` },
        query: req.query,
      })
      res.json(_res)
    }
    catch (e)
    {
      res.json(errorHandler(e.message))
    }
  })
  router.post('*', async (req, res, next) => {
    try
    {
      let token = req.cookies[cookie.prefix + '-token'] || undefined
      if (!token) throw new Error('NO-TOKEN')
      const _res = await api(req.path, {
        method: 'post',
        headers: { 'Authorization': `Bearer ${token}` },
        body: req.body,
      })
      res.json(_res)
    }
    catch (e)
    {
      res.json(errorHandler(e.message))
    }
  })
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
    baseURL: filteringHostname(VITE_API_URL),
    retry: 1,
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
  app.use(`${env.VITE_BASE_URL}/local/`.replace(/\/\//gi, '/'), localRoutes())
  // set service api routes
  // app.use(`${env.VITE_BASE_URL}/api`.replace(/\/\//gi, '/'), apiRoutes())
}

export default server
