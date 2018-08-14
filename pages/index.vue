<template>
<article>
	<page-header title="Dashboard" description="welcome to goose manager"/>

	<section v-if="articles && articles.length">
		<h1>Articles</h1>
		<index-articles :articles="articles" skin="card"/>
	</section>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';

const params = {
	articlesDefault: {
		field: 'srl,title,hit,regdate,category_srl,json',
		order: 'srl',
		sort: 'desc',
		size: 50
	}
};

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'IndexArticles': () => import('~/components/pages/articles/index-articles'),
		'Error': () => import('~/components/contents/error'),
	},
	data()
	{
		return {};
	},
	async asyncData(cox)
	{
		try
		{
			let data = {};
			const [ articles ] = await Promise.all([
				cox.$axios.$get(`/articles${text.serialize(params.articlesDefault, true)}`)
			]);
			if (articles.success) data.articles = articles.data.index;
			console.log(data);
			return data;
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : messages.error.service,
			});
		}
	}
};
</script>