<template>
<article>
	<page-header module="articles" :title="`${nestName ? `[${nestName}]` : ''} Articles`"/>

	<error v-if="!!error" :message="error"/>
	<template v-else>
		<index-categories
			:nest_srl="nest_srl"
			:categories="categories"
			:category_srl="category_srl"
			@change="onChangeCategory"/>
		<index-articles
			:nest_srl="nest_srl"
			:category_srl="category_srl"
			:total="total"
			:articles="articles"
			:loading="loading"/>
	</template>

	<nav class="rg-nav">
		<button-basic label="Nests" to="/nests" :inline="true"/>
		<button-basic label="Categories" :to="`/categories/${this.nest_srl}`" :inline="true"/>
		<button-basic
			label="Add Article"
			:to="`/articles/${this.nest_srl}/add${category_srl ? `?category=${category_srl}` : ''}`"
			:inline="true"
			color="key"/>
	</nav>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'IndexArticles': () => import('~/components/pages/articles/index-articles'),
		'IndexCategories': () => import('~/components/pages/articles/index-categories'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Error': () => import('~/components/contents/error'),
	},
	validate(cox)
	{
		return cox.params.nest && /^\d+$/.test(cox.params.nest);
	},
	async asyncData(cox)
	{
		let nest_srl = parseInt(cox.params.nest) || null;
		let category_srl = cox.query.category ? cox.query.category : '';

		try
		{
			const [ categories, articles, nest ] = await Promise.all([
				cox.$axios.$get(`/categories?nest=${nest_srl}&ext_field=count_article,item_all,none`),
				cox.$axios.$get(`/articles?nest=${nest_srl}${category_srl ? `&category=${category_srl}` : ''}&ext_field=category_name&order=srl&sort=desc`),
				cox.$axios.$get(`/nests/${nest_srl}?field=name`)
			]);
			return {
				nest_srl,
				category_srl,
				error: null,
				loading: false,
				total: articles.success ? articles.data.total : 0,
				articles: articles.success ? articles.data.index : null,
				categories: categories.success ? categories.data.index : null,
				nestName: nest.success ? nest.data.name : null,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	},
	methods: {
		async onChangeCategory(srl)
		{
			// on loading
			this.loading = true;
			// change url
			this.$router.replace(this.setCategoryUrl(srl));
			// change category_srl
			this.category_srl = srl;

			// get articles
			try
			{
				let url = `/articles?nest=${this.nest_srl}`;
				if (this.category_srl) url += `&category=${this.category_srl}`;
				url += '&ext_field=category_name';
				const articles = await this.$axios.$get(url);
				this.total = articles.success ? articles.data.total : 0;
				this.articles = articles.success ? articles.data.index : null;
				this.loading = false;
			}
			catch(e)
			{
				this.loading = false;
				return { error: (typeof e === 'string') ? e : messages.error.service };
			}
		},
		setCategoryUrl(srl)
		{
			let params = '';
			switch(srl)
			{
				case '':
					params = '';
					break;
				case 'none':
					params = '?category=null';
					break;
				default:
					params = srl ? `?category=${srl}` : '';
					break;
			}
			return `/articles/${this.nest_srl}${params}`;
		}
	}
}
</script>