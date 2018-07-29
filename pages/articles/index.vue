<template>
<article>
	<page-header module="articles"/>

	<error v-if="!!error" :message="error"/>
	<index-articles v-else :total="total" :articles="articles"/>
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
	async asyncData(cox)
	{
		try
		{
			const articles = await cox.$axios.$get(`/articles?ext_field=category_name`);

			return {
				total: articles.success ? articles.data.total : 0,
				articles: articles.success ? articles.data.index : [],
				error: null,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	}
}
</script>