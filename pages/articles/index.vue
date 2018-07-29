<template>
<article>
	<page-header module="articles"/>

	<template v-if="!error">
		<index-articles
			:total="total"
			:articles="articles"
			:loading="loading"/>
	</template>
	<error v-else :message="error"/>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import IndexArticles from '~/components/pages/articles/index-articles';
import Error from '~/components/contents/error';
// library
import * as messages from '~/libs/messages';

export default {
	components: {
		PageHeader,
		IndexArticles,
		Error,
	},
	data()
	{
		return {
			error: null,
			loading: false,
		};
	},
	async asyncData(cox)
	{
		try
		{
			const articles = await cox.$axios.$get(`/articles?ext_field=category_name`);

			return {
				total: articles.success ? articles.data.total : 0,
				articles: articles.success ? articles.data.index : [],
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	}
}
</script>