<template>
<article>
	<page-header module="articles"/>

	<template v-if="!error">
		<index-categories
			:nest_srl="nest_srl"
			:categories="categories"
			:category_srl="category_srl"
			@change="onChangeCategory"/>
		<index-articles
			:total="total"
			:articles="articles"
			:loading="loading"/>
	</template>
	<error v-else :message="error"/>

	<nav class="rg-nav">
		<button-basic label="Nests" to="/nests" :inline="true"/>
		<button-basic label="Categories" :to="`/categories/${this.nest_srl}`" :inline="true"/>
		<button-basic label="Add Article" :to="`/articles/${this.nest_srl}/add`" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import ButtonBasic from '~/components/button/basic';
import IndexArticles from '~/components/pages/articles/index-articles';
import IndexCategories from '~/components/pages/articles/index-categories';
import Error from '~/components/contents/error';
// library
import * as messages from '~/libs/messages';

export default {
	components: {
		PageHeader,
		IndexArticles,
		IndexCategories,
		ButtonBasic,
		Error,
	},
	validate(cox)
	{
		return cox.params.nest && /^\d+$/.test(cox.params.nest);
	},
	data()
	{
		return {
			nest_srl: parseInt(this.$route.params.nest),
			category_srl: this.$route.query.category ? parseInt(this.$route.query.category) : 0,
			error: null,
			loading: false,
		};
	},
	async asyncData(cox)
	{
		let nest_srl = parseInt(cox.params.nest) || null;
		let category_srl = cox.query.category ? parseInt(cox.query.category) : 0;

		try
		{
			const [ categories, articles ] = await Promise.all([
				cox.$axios.$get(`/categories?nest=${nest_srl}&ext_field=count_article,item_all`),
				cox.$axios.$get(`/articles?nest=${nest_srl}${category_srl ? `&category=${category_srl}` : ''}&ext_field=category_name`)
			]);
			return {
				total: articles.success ? articles.data.total : 0,
				articles: articles.success ? articles.data.index : null,
				categories: categories.success ? categories.data.index : null,
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
			if (this.category_srl === srl) return;

			// on loading
			this.loading = true;
			// change url
			this.$router.replace(`/articles/${this.nest_srl}${srl ? `?category=${srl}` : ''}`);
			// change category_srl
			this.category_srl = srl;

			// get articles
			try
			{
				const articles = await this.$axios.$get(`/articles?nest=${this.nest_srl}${this.category_srl ? `&category=${this.category_srl}` : ''}&ext_field=category_name`);
				this.total = articles.success ? articles.data.total : 0;
				this.articles = articles.success ? articles.data.index : null;
				this.loading = false;
			}
			catch(e)
			{
				this.loading = false;
				return { error: (typeof e === 'string') ? e : messages.error.service };
			}
		}
	}
}
</script>