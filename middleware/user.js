export default function(cox)
{
	const { store, error } = cox;

	if (store.state.level.admin > store.state.authUser.level)
	{
		// 레벨이 딸림

		// TODO: 자기꺼인지 검사
		console.log('MNGIDSMPGMDPSG')
	}

}