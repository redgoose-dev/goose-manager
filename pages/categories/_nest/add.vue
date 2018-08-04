<template>
<article>
	<page-header module="categories" title="Add category"/>
	<post type="add" :nest_srl="nest_srl"/>
</article>
</template>

<script>
export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'Post': () => import('~/components/pages/categories/post'),
	},
	validate(cox)
	{
		return cox.params.nest && /^\d+$/.test(cox.params.nest);
	},
	data()
	{
		return {
			nest_srl: parseInt(this.$route.params.nest)
		};
	}
}
</script>