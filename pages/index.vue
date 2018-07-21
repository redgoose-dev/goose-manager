<template>
	<article>
		<h1>welcome page</h1>
		<div>intro..</div>
	</article>
</template>

<script>
export default {
	data()
	{
		return {};
	},
	async mounted()
	{
		const { $axios } = this;

		// let aa = await $axios.$get('/token/decode');
		// console.log(aa);
	}
};
</script>