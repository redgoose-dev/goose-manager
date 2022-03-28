import axios from 'axios';
import { Router } from 'express';

let cookie, app, env, api;

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
      const { email, password, save } = req.body;
      // request to api
      const apiRes = await api.post('/auth/login/', {
        email,
        password,
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
      if (save)
      {
        res.cookie(cookie.prefix + '-token', token, cookie.options);
        res.cookie(cookie.prefix + '-user', JSON.stringify(user, null, ''), cookie.options);
      }
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

  // refresh token
  router.post('/refresh-token/', async (req, res) => {
    const { token } = req.body;
    if (!token) return;
    res.cookie(cookie.prefix + '-token', token, cookie.options);
    res.json({ token });
  });

  // TODO: 저번 버전같이 `preference.json`파일을 만들어서 관리하는것이 가장좋은 방법인거 같다.;
  // TODO: 아니면 json 모듈에 있는 데이터베이스에다 저장하는 방법도 있을 것이다.
  // TODO: 위에 두가지 다 방법이 비슷비슷한 수준이다.
  // TODO: users 테이블쪽에 json 필드가 있는데 그걸 활용하는 방법도 있는데 이 공간이 가장 좋아 보인다. 하지만 저기다 너무 많이 사용하지 않을까 하는 걱정도 되고..

  // TODO: 로그를 기록하는 기능 만들기

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
  const { VITE_COOKIE_PREFIX, VITE_COOKIE_EXPIRY, VITE_TOKEN_PUBLIC, VITE_API_URL } = env;
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
    baseURL: VITE_API_URL,
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
