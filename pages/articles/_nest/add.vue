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
			const [ nest, categories, files ] = await Promise.all([
				cox.$axios.$get(`/nests/${nest_srl}`).then((res) => {
					return res.success ? res.data : null;
				}),
				cox.$axios.$get(`/categories?nest=${nest_srl}&field=srl,name,turn&order=turn&sort=asc&strict=1`).then((res) => {
					return res.success ? res.data.index : [];
				}),
				cox.$axios.$get(`/files?ready=true&strict=1`)
			]);

			if (!nest) throw 'No data for `Nest`.';

			return {
				nest_srl,
				category_srl,
				skin: nest.json.articleSkin || 'default',
				datas: {
					nest,
					categories: categories.map((o) => {
						return {
							label: o.name,
							value: o.srl
						};
					}),
					files: (files.success && files.data.index.length) ? files.data.index.map((o) => {
						return {
							id: parseInt(o.srl),
							srl: parseInt(o.srl),
							name: o.name,
							size: parseInt(o.size),
							src: `${o.loc}`,
							type: o.type,
							ready: parseInt(o.ready),
						};
					}) : null
				}
			};
		}
		catch(e)
		{
			console.error(e);
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