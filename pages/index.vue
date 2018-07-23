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
	async asyncData(cox)
	{
		let decode = await cox.$axios.$get('/token/decode');
		console.log(decode);
	},
	async mounted()
	{}
};
</script>