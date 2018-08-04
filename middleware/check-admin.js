export default function(cox)
{
	const { store, error } = cox;

	if (!store.state.authUser.admin)
	{
		error({
			message: 'You do not have permission to access.',
			statusCode: 403
		})
	}
}