export default function(cox)
{
	const { store, redirect, route, isDev } = cox;

	// print current route
	if (isDev)
	{
		console.warn(`REDIRECT TO: ${route.name} :: ${route.path}`);
	}

	// check auth
	// TODO: 로그인 검사
	if (!!false)
	{
		redirect('/auth/login');
	}
}