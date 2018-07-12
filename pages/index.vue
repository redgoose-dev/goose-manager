<template>
	<div>
		hello world
	</div>
</template>

<script>
export default {
	mounted()
	{
		const { $axios } = this;

		console.log($axios);
	}
};
</script>