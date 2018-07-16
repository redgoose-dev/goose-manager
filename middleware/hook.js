export default function(cox)
{
	const { store, redirect, route, isDev } = cox;

	// print current route
	if (isDev)
	{
		console.warn(`REDIRECT TO: ${route.name} :: ${route.path}`);
	}

	// check auth
	// TODO: 퍼블리싱을 위해 로그인 체크를 안함
	// if (!(store.state.user && store.state.user.srl))
	// {
	// 	redirect('/auth/login');
	// }
}