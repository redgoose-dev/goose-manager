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
			:page="page"
			:total="total"
			:articles="articles"
			:skin="skin"
			:loading="processing"/>
		<paginate
			v-if="!!total"
			v-model="page"
			url="/articles"
			:page-count="Math.ceil(total/size)"
			@input="onChangePage"/>
	</template>

	<nav class="rg-nav">
		<dl>
			<dt>
				<button-basic label="Nests" to="/nests" :inline="true"/>
				<button-basic label="Categories" :to="`/categories/${this.nest_srl}`" :inline="true"/>
			</dt>
			<dd>
				<button-basic
					label="Add Article"
					:to="`/articles/${this.nest_srl}/add${category_srl ? `?category=${category_srl}` : ''}`"
					:inline="true"
					color="key"/>
			</dd>
		</dl>
	</nav>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';

const defaultParamsArticle = {
	field: 'srl,title,hit,regdate,category_srl,json',
	ext_field: 'category_name',
	order: 'srl',
	sort: 'desc',
};
const defaultParamsCategory = {
	ext_field: 'count_article,item_all,none',
};

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'IndexArticles': () => import('~/components/pages/articles/index-articles'),
		'IndexCategories': () => import('~/components/pages/articles/index-categories'),
		'Paginate': () => import('~/components/etc/paginate'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Error': () => import('~/components/contents/error'),
	},
	validate(cox)
	{
		return cox.params.nest && /^\d+$/.test(cox.params.nest);
	},
	async asyncData(cox)
	{
		const page = parseInt(cox.query.page || 1);
		const size = parseInt(cox.env.PAGE_PER_SIZE) || 20;
		const nest_srl = parseInt(cox.params.nest) || null;
		const category_srl = cox.query.category ? cox.query.category : '';

		// make params for articles
		let paramsArticle = Object.assign({}, defaultParamsArticle);
		paramsArticle.nest = nest_srl;
		paramsArticle.size = size;
		if (page > 1) paramsArticle.page = page;
		if (category_srl) paramsArticle.category = category_srl;

		// make params for category
		let paramsCategory = Object.assign({}, defaultParamsCategory);
		paramsCategory.nest = nest_srl;

		try
		{
			const [ categories, articles, nest ] = await Promise.all([
				cox.$axios.$get(`/categories${text.serialize(paramsCategory, true)}`),
				cox.$axios.$get(`/articles${text.serialize(paramsArticle, true)}`),
				cox.$axios.$get(`/nests/${nest_srl}?field=name,json`)
			]);
			return {
				nest_srl,
				category_srl,
				page,
				size,
				error: null,
				processing: false,
				total: articles.success ? articles.data.total : 0,
				articles: articles.success ? articles.data.index : null,
				categories: categories.success ? categories.data.index : null,
				nestName: nest.success ? nest.data.name : null,
				skin: nest.success && nest.data.json.articleSkin ? nest.data.json.articleSkin : null,
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
			try
			{
				// change url
				this.$router.replace(this.setCategoryUrl(srl));

				// update data
				this.processing = true;
				this.category_srl = srl;
				this.page = 1;

				// get articles
				let paramsArticle = Object.assign({}, defaultParamsArticle);
				paramsArticle.nest = this.nest_srl;
				paramsArticle.size = this.size;
				paramsArticle.page = 1;
				if (this.category_srl) paramsArticle.category = this.category_srl;
				const articles = await this.$axios.$get(`/articles${text.serialize(paramsArticle, true)}`);

				this.total = articles.success ? articles.data.total : 0;
				this.articles = articles.success ? articles.data.index : null;
				this.processing = false;
			}
			catch(e)
			{
				this.processing = false;
				return { error: (typeof e === 'string') ? e : messages.error.service };
			}
		},
		async onChangePage(page)
		{
			try
			{
				// change url
				let params = {};
				if (this.category_srl) params.category = this.category_srl;
				if (page > 1) params.page = page;
				this.$router.replace(`/articles/${this.nest_srl}${text.serialize(params, true)}`);

				this.processing = true;

				// get articles
				let paramsArticle = Object.assign({}, defaultParamsArticle);
				paramsArticle.nest = this.nest_srl;
				paramsArticle.size = this.size;
				paramsArticle.page = page;
				if (this.category_srl) paramsArticle.category = this.category_srl;
				const articles = await this.$axios.$get(`/articles${text.serialize(paramsArticle, true)}`);

				// update data
				this.total = articles.success ? articles.data.total : 0;
				this.articles = articles.success ? articles.data.index : null;
				this.page = page;
				this.processing = false;
			}
			catch(e)
			{
				this.processing = false;
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