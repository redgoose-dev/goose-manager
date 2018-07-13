export default function(cox)
{
	const { store, redirect, route, isDev } = cox;

	// print current route
	if (isDev)
	{
		console.warn(`REDIRECT TO: ${route.name} :: ${route.path}`);
	}

	// check auth
	if (!(store.state.user && store.state.user.srl))
	{
		redirect('/auth/login');
	}
}