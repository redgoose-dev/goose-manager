<template>
<article>
	<page-header
		module="articles"
		:title="`${nest ? `[${nest.name}]` : ''} Articles`"
		:description="computedDescription"/>

	<error v-if="!!error" :message="error"/>
	<template v-else>
		<index-categories
			:nest_srl="nest_srl"
			:categories="categories"
			:category_srl="category_srl"
			@change="category_srl = $event"/>
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
			:pageRange="8"
			@input="onChangePage"/>
	</template>

	<nav class="rg-nav">
		<dl>
			<dt>
				<button-basic
					label="Nests"
					to="/nests"
					:inline="true"/>
				<button-basic
					v-if="(nest && parseInt(nest.json.useCategory) === 1)"
					label="Categories"
					:to="`/categories/${this.nest_srl}`"
					:inline="true"/>
			</dt>
			<dd>
				<button-basic
					label="Add article"
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
	field: 'srl,type,title,hit,regdate,category_srl,json,`order`',
	ext_field: 'category_name',
	order: 'srl',
	sort: 'desc',
	visible_type: 'all',
};
const defaultParamsCategory = {
	ext_field: 'count_article,item_all,none',
};

export default {
	name: 'page-articles-index',
	components: {
		'page-header': () => import('~/components/contents/page-header'),
		'index-articles': () => import('~/components/pages/articles/index-articles'),
		'index-categories': () => import('~/components/pages/articles/index-categories'),
		'paginate': () => import('~/components/etc/paginate'),
		'button-basic': () => import('~/components/button/basic'),
		'error': () => import('~/components/contents/error'),
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
				cox.$axios.$get(`/nests/${nest_srl}?field=name,json,description`)
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
				nest: nest.success ? nest.data : null,
				skin: nest.success && nest.data.json.articleSkin ? nest.data.json.articleSkin : null,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	},
	computed: {
		computedDescription()
		{
			return this.nest.description || null;
		},
	},
	watch: {
		category_srl()
		{
			this.onChangeCategory().then();
		},
	},
	methods: {
		async onChangeCategory()
		{
			try
			{
				// change url
				this.$router.replace(this.setCategoryUrl(this.category_srl));

				// update data
				this.processing = true;
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
		},
	},
}
</script>