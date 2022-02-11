import axios from 'axios';
import { Router } from 'express';

let cookie, app, env, api;

function getApiUrl(url)
{
  const { VITE_API_URL } = env;
  return VITE_API_URL + url;
}

/**
 * local routes
 */
function localRoutes()
{
  const router = Router();

  // auth
  router.post('/auth', async (req, res) => {
    try
    {
      let token = req.cookies[cookie.prefix + '-token'];
      let user = req.cookies[cookie.prefix + '-user'];
      user = JSON.parse(user);
      if (!user.srl) throw new Error('Invalid user data');
      res.json({
        success: true,
        data: { token, user },
      });
    }
    catch(e)
    {
      res.json({
        success: false,
        message: 'Failed authorization.',
      })
    }
  });

  // login
  router.post('/login', async (req, res) => {
    try
    {
      const { email, password, host } = req.body;
      // request to api
      const apiRes = await api.post(getApiUrl('/auth/login/'), {
        email,
        password,
        host,
      });
      // check response values
      if (!(apiRes.data.success && !!apiRes.data?.data))
      {
        throw new Error(apiRes.data.message);
      }
      let token = apiRes.data.data.token;
      let user = apiRes.data.data;
      delete user.token;
      delete user.host;
      // set cookie
      res.cookie(cookie.prefix + '-token', token, cookie.options);
      res.cookie(cookie.prefix + '-user', JSON.stringify(user, null, ''), cookie.options);
      // result
      res.json({
        success: true,
        data: { user, token },
      });
    }
    catch (e)
    {
      res.json({
        success: false,
        message: e.message || 'Failed login',
      });
    }
  });

  // logout
  router.post('/logout', async (req, res) => {
    res.clearCookie(cookie.prefix + '-token');
    res.clearCookie(cookie.prefix + '-user');
    res.json({ success: true });
  });

  return router;
}

/**
 * setup
 *
 * @param {Express} _app
 * @param {object} _env
 */
function setup(_app, _env)
{
  app = _app;
  env = _env;
  const { VITE_COOKIE_PREFIX, VITE_COOKIE_EXPIRY, VITE_TOKEN_PUBLIC } = env;
  // set cookie assets
  cookie = {
    prefix: VITE_COOKIE_PREFIX,
    options: {
      maxAge: 1000 * 60 * 60 * 24 * Number(VITE_COOKIE_EXPIRY),
      httpOnly: true,
      secure: true,
      path: '/',
    }
  };
  // set api instance
  api = new axios.create({
    headers: { 'Authorization': 'Bearer ' + VITE_TOKEN_PUBLIC },
  });
}

/**
 * server
 *
 * @param {Express} _app
 * @param {object} _env
 */
function server(_app, _env)
{
  setup(_app, _env);
  // set local routes
  app.use('/local', localRoutes());
}

export default server;