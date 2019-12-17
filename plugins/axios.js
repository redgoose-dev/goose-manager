import * as msg from '../libs/messages';

export default function(cox)
{
	const { $axios, store, error } = cox;
	const debug = store.state.preference.debug.api;

	// check
	if (!process.env.TOKEN_PUBLIC)
	{
		return error({
			statusCode: 500,
			message: (cox.isDev) ? 'No TOKEN_PUBLIC in .env' : msg.service.error
		});
	}
	if (!process.env.APP_API_URL)
	{
		return error({
			statusCode: 500,
			message: (cox.isDev) ? 'No APP_API_URL in .env' : msg.service.error
		});
	}

	// set token
	let token = null;
	let host = (process.server) ? cox.req.headers.host : location.host;
	if (cox.req && cox.req.session && cox.req.session.authUser)
	{
		if (host === cox.req.session.authUser.host)
		{
			token = cox.req.session.authUser.token;
		}
	}
	else if (cox.store.state.authUser)
	{
		if (host === cox.store.state.authUser.host)
		{
			token = cox.store.state.authUser.token;
		}
	}
	token = token || process.env.TOKEN_PUBLIC;

	// set header
	$axios.setHeader('Accept', 'application/json;charset=UTF-8');
	$axios.setHeader('Authorization', token);
	//$axios.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');

	if (debug)
	{
		// on request
		$axios.onRequest(config => {
			console.log('Request URL: ' + config.url);
		});
		// on error
		$axios.onError(error => {
			console.error('ERROR: ', error.message);
		});
	}
}
