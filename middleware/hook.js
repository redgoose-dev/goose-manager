export default function(cox)
{
	const { store, redirect, route, isDev } = cox;
	const { preference } = store.state;

	// print current route
	if (preference.debug.route)
	{
		console.warn(`REDIRECT TO: ${route.name} :: ${route.path}`);
	}

	// check auth
	if (!store.state.authUser)
	{
		redirect('/auth/login');
	}
}