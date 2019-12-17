const express = require('express');
const router = express.Router();
const fs = require('fs');
const app = express();

const path_preference = './preference.json';


// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request);
  Object.setPrototypeOf(res, app.response);
  req.res = res;
  res.req = req;
  next();
});

/**
 * 세션 저장
 */
router.post('/session-save/', (req, res) => {
  if (req.body && req.body.srl && req.body.email && req.body.token)
  {
    // set time
    req.session.cookie.maxAge = req.body.save ? 60000 * 60 * 6 * 30 : 60000 * 60 * 6; // ms * m * h * d
    // set data
    req.session.authUser = req.body;
    // save
    req.session.save();
    // result
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Bad credentials' })
});

/**
 * 세션 전부 지우기
 */
router.post('/session-clear/', (req, res) => {
  delete req.session.authUser;
  res.json({ success: true });
});

/**
 * save preference
 * 환경설정 저장
 */
router.post('/preference-save/', (req, res) => {
  try
  {
    let src = {
      foo: 'bar',
      age: 24,
      gender: 'smdgi sdgmkps gd',
    };
    let data = JSON.stringify(src, null, 2);
    fs.writeFileSync(path_preference, data);
    res.json({ success: true });
  }
  catch(e)
  {
    res.json({ success: false });
  }
});

/**
 * load preference
 * 환경설정 불러오기
 */
router.get('/preference-load/', (req, res) => {
  try
  {
    let raw = fs.readFileSync(path_preference);
    let json = JSON.parse(raw);
    res.json({ success: true, data: json });
  }
  catch(e)
  {
    res.json({ success: false, data: null });
  }
});


// export
module.exports = {
  path: '/api',
  handler: router
};
