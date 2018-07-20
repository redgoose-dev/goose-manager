import * as msg from '../libs/messages';

export default function(cox)
{
	const { $axios, error } = cox;

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
	if (cox.store.state.authUser)
	{
		let host = (process.server) ? cox.req.headers.host : location.host;
		if (host === cox.store.state.authUser.host)
		{
			token = cox.store.state.authUser.token;
		}
	}
	token = token || process.env.TOKEN_PUBLIC;

	// set header
	$axios.setHeader('Authorization', token);
}
