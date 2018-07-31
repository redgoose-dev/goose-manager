<template>
<article>
	<page-header module="categories" title="Add category"/>
	<post type="add" :nest_srl="nest_srl"/>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import Post from '~/components/pages/categories/post';

export default {
	components: {
		PageHeader,
		Post,
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