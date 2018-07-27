<template>
<article>
	<page-header module="articles"/>

	<nav v-if="categories && categories.length" class="rg-nav-bar">
		<ul>
			<li v-for="(item,key) in categories" :key="key">
				<nuxt-link :to="`/article/${nest_srl}/${item.srl}`">
					{{item.name}}
				</nuxt-link>
			</li>
		</ul>
	</nav>

	<div v-if="!error && articles && articles.length" class="rg-index rg-index-card">
		<ul>
			<li v-for="(item,key) in articles" :key="key">
				<item-index-card
					:link="`/articles/read/${item.srl}`"
					:subject="item.title"
					:metas="[
						`Category: xxx`,
						`Hit: ${item.hit}`,
						`Date: ${getDate(item.regdate)}`
					]"
					:navs="[
					{ label: 'Edit', link: `/apps/${item.srl}/edit` },
					{ label: 'Delete', link: `/apps/${item.srl}/delete` }
				]"/>
			</li>
		</ul>
	</div>
	<div v-else class="rg-index-error">
		{{error}}
	</div>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import ItemIndexCard from '~/components/contents/item-index-card';
import ButtonBasic from '~/components/button/basic';
import * as messages from '../../../libs/messages';
import * as dates from '../../../libs/dates';

export default {
	components: {
		PageHeader,
		ItemIndexCard,
		ButtonBasic,
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	data()
	{
		return {
			nest_srl: parseInt(this.$route.params.srl),
		};
	},
	async asyncData(cox)
	{
		try
		{
			const [ articles, categories ] = await Promise.all([
				cox.$axios.$get(`/articles?nest=${cox.params.srl}`),
				cox.$axios.$get(`/categories?nest=${cox.params.srl}`)
			]);
			if (!articles.success) throw 'Failed get data';

			return {
				total: articles.data.total,
				articles: articles.data.index,
				categories: categories.success ? categories.data.index : null,
				error: null,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	},
	methods: {
		getDate: function(date)
		{
			return dates.getFormatDate(date, false);
		}
	}
}
</script>