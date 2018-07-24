export default function(cox)
{
	const { store, error } = cox;

	if (store.state.level.admin > store.state.authUser.level)
	{
		error({
			message: 'You do not have permission to access.',
			statusCode: 403
		})
	}
}