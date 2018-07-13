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

	if (!process.env.URL_API)
	{
		return error({
			statusCode: 500,
			message: (cox.isDev) ? 'No URL_API in .env' : msg.service.error
		});
	}

	// TODO: 유저 토큰이 쿠키속에 들어있다면 그걸 사용하고 없으면 퍼블릭으로 사용함
	// set token
	$axios.setHeader('Authorization', process.env.TOKEN_PUBLIC);
}
