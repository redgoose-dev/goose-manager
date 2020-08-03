import * as messages from '../libs/messages';

export default function(cox)
{
	const { $axios, store, error } = cox;
	const debug = store.state.preference.debug.api;

	// check
	if (!process.env.TOKEN_PUBLIC)
	{
		return error({
			statusCode: 500,
			message: (cox.isDev) ?  messages.printf(messages.error.noKeywords, 'TOKEN_PUBLIC', '.env') : messages.service.error
		});
	}
	if (!process.env.APP_API_URL)
	{
		return error({
			statusCode: 500,
			message: (cox.isDev) ? messages.printf(messages.error.noKeywords, 'APP_API_URL', '.env') : messages.service.error
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
	else if (store.state.authUser)
	{
		if (host === store.state.authUser.host)
		{
			token = store.state.authUser.token;
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
	$axios.onResponse(res => {
    switch (res.data.code)
    {
      case 401:
        // 로그인된 상태라면 로그아웃 리다이렉트 시키기
        if (location && store.state.authUser)
        {
          location.href = `${store.state.path_root}/auth/logout/`;
        }
        break;
    }
  });
}
