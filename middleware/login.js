export default function({ store, req, redirect })
{
	// check token
	if (store.state.authUser)
	{
		redirect('/');
	}
}