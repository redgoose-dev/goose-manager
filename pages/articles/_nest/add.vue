<template>
<article>
	<page-header module="articles" title="Add article"/>
	<post
		ref="post"
		type="add"
		:nest_srl="nest_srl"
		:category_srl="category_srl"
		:skin="skin"
		:datas="datas"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'Post': () => import('~/components/pages/articles/post'),
	},
	validate(cox)
	{
		return cox.params.nest && /^\d+$/.test(cox.params.nest);
	},
	async asyncData(cox)
	{
		try
		{
			const nest_srl = cox.params.nest;
			const category_srl = cox.query.category || null;
			const [ nest, categories ] = await Promise.all([
				cox.$axios.$get(`/nests/${nest_srl}`).then((res) => {
					return res.success ? res.data : null;
				}),
				cox.$axios.$get(`/categories?nest=${nest_srl}&field=srl,name,turn&order=turn&sort=asc`).then((res) => {
					return res.success ? res.data.index : [];
				}),
			]);

			if (!nest) throw 'No data for `Nest`.';

			return {
				nest_srl,
				category_srl,
				skin: nest.json.articleSkin || 'default',
				datas: {
					nest,
					categories: categories.map((o) => ({ label: o.name, value: o.srl }))
				}
			};
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : messages.error.service,
			});
		}
	},
	mounted()
	{
		setTimeout(() => this.$refs.post.$refs.form.title.focus(), 200);
	}
}
</script>