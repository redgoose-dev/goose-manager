<template>
<article>
	<page-header module="articles"/>

	<nav v-if="categories && categories.length" class="rg-nav-bar">
		<ul>
			<li v-for="(item,key) in categories" :key="key">
				<a
					:href="`/articles/index/${nest_srl}${item.srl ? `?category=${item.srl}` : ''}`"
					:data-srl="item.srl"
					@click="onChangeCategory"
					:class="[ (parseInt(item.srl) === category_srl) && 'active' ]">
					<span>{{item.name}}</span>
					<em>{{item.count_article}}</em>
				</a>
			</li>
		</ul>
	</nav>

	<div v-if="!!articles && articles.length" class="rg-index rg-index-card">
		<ul>
			<li v-for="(item,key) in articles" :key="key">
				<item-index-card
					:link="`/articles/read/${item.srl}`"
					:subject="item.title"
					:metas="[
						item.category_name && `Category: ${item.category_name}`,
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
		no item
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
			let category_srl = cox.query.category ? parseInt(cox.query.category) : 0;
			const [ articles, categories ] = await Promise.all([
				cox.$axios.$get(`/articles?nest=${cox.params.srl}${category_srl ? `&category=${category_srl}` : ''}&ext_field=category_name`),
				cox.$axios.$get(`/categories?nest=${cox.params.srl}&ext_field=count_article,item_all`)
			]);

			return {
				total: articles.success ? articles.data.total : 0,
				articles: articles.success ? articles.data.index : [],
				categories: categories.success ? categories.data.index : [],
				category_srl,
				error: null,
			};
		}
		catch(e)
		{
			console.error(e);
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	},
	methods: {
		getDate(date)
		{
			return dates.getFormatDate(date, false);
		},
		onChangeCategory(e)
		{
			e.preventDefault();
			console.log(e.currentTarget.dataset.srl);
			// TODO: 카테고리가 변했을때 페이지 변경하기
		}
	}
}
</script>