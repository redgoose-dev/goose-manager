<template>
<article>
	<page-header module="articles"/>

	<error v-if="!!error" :message="error"/>
	<index-articles
		v-else
		:total="total"
		:articles="articles"
		:loading="processing"
		skin="card"/>

	<paginate
		v-if="!!total"
		v-model="page"
		url="/articles"
		:page-count="Math.ceil(total/size)"
		:pageRange="8"
		@input="onChangePage"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';

const defaultParams = {
	field: 'srl,title,hit,star,regdate,category_srl,json',
	ext_field: 'category_name',
	order: 'srl',
	sort: 'desc',
};

export default {
	components: {
		'page-header': () => import('~/components/contents/page-header'),
		'index-articles': () => import('~/components/pages/articles/index-articles'),
		'paginate': () => import('~/components/etc/paginate'),
		'error': () => import('~/components/contents/error'),
	},
	async asyncData(cox)
	{
		try
		{
			const page = parseInt(cox.query.page || 1);
			const size = parseInt(cox.env.APP_PAGE_PER_SIZE) || 20;
			let params = {
				...defaultParams,
				size
			};
			if (page > 1) params.page = page;

			// get articles
			const articles = await cox.$axios.$get(`/articles${text.serialize(params, true)}`);
			if (!articles.success) throw articles.message;

			return {
				total: articles.success ? articles.data.total : 0,
				articles: articles.success ? articles.data.index : [],
				page,
				size,
				processing: false,
				error: null,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	},
	methods: {
		async onChangePage(page)
		{
			try
			{
				// change url
				this.$router.replace(`/articles${page > 1 ? `?page=${page}` : ''}`);

				this.processing = true;

				// get articles
				let params = { ...defaultParams, size: this.size };
				if (page > 1) params.page = page;
				const articles = await this.$axios.$get(`/articles${text.serialize(params, true)}`);
				if (!articles.success) throw articles.message;

				// change data
				this.page = page;
				this.error = null;
				this.total = articles.data.total;
				this.articles = articles.data.index;
				this.processing = false;
			}
			catch(e)
			{
				this.processing = false;
				this.error = (typeof e === 'string') ? e : messages.error.service;
			}
		}
	}
}
</script>