<template></template>

<script>
export default {
	layout: 'blank',

	async mounted()
	{
		const { $store, $axios, $router } = this;

		// check user in store
		if (!$store.state.authUser)
		{
			alert('You have already logged out.');
			$router.go(-1);
		}

		try
		{
			// logout api
			await $axios.$post(`/auth/logout`);
			// remove session
			await $axios.$post(`${$store.state.url_app}/api/session-clear`);
			// redirect home
			location.href = '/';
		}
		catch(e)
		{
			alert(e);
			console.error(e);
			$router.go(-1);
		}
	}
};
</script>