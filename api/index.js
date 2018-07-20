const express = require('express');
const router = express.Router();

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const app = express();
router.use((req, res, next) => {
	Object.setPrototypeOf(req, app.request);
	Object.setPrototypeOf(res, app.response);
	req.res = res;
	res.req = req;
	next();
});


// Add POST - /session-save
router.post('/session-save', (req, res) => {
	if (!!true)
	{
		// req.session.authUser = {
		// 	username: 'demo'
		// };
		return res.json({ success: true });
	}
	res.status(401).json({ success: false, message: 'Bad credentials' })
});

// Add POST - /session-remove
router.post('/session-remove', (req, res) => {
	delete req.session.authUser;
	res.json({ success: true });
});


// export
module.exports = {
	path: '/api',
	handler: router
};