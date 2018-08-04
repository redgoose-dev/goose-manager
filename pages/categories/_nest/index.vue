<template>
<article>
	<page-header module="categories"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else class="rg-index-card">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-card
					:subject="`[${item.srl}] ${item.name}`"
					:metas="[
						`Nest srl: ${item.nest_srl}`,
						`Date: ${getDate(item.regdate)}`
					]"
					:navs="[
						{
							label: 'Edit',
							link: `/categories/${item.srl}/edit${nest_srl ? `?nest=${nest_srl}` : ''}`
						},
						{
							label: 'Delete',
							link: `/categories/${item.srl}/delete${nest_srl ? `?nest=${nest_srl}` : ''}`
						},
					]"/>
			</li>
		</ul>
	</div>

	<nav v-if="nest_srl" class="rg-nav">
		<button-basic label="Nests" to="/nests" :inline="true"/>
		<button-basic label="Articles" :to="`/articles/${nest_srl}`" :inline="true"/>
		<button-basic label="Add Category" :to="`/categories/${nest_srl}/add`" :inline="true" color="key"/>
	</nav>
	<nav v-else class="rg-nav">
		<button-basic label="Nests" to="/nests" :inline="true"/>
		<button-basic label="Articles" to="/articles" :inline="true"/>
	</nav>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'ItemIndexCard': () => import('~/components/contents/item-index-card'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Error': () => import('~/components/contents/error'),
	},
	validate(cox)
	{
		if (!cox.params.nest) return true;
		return /^\d+$/.test(cox.params.nest);
	},
	async asyncData(cox)
	{
		let nest_srl = parseInt(cox.params.nest) || null;
		try
		{
			let params = (nest_srl) ? `?nest=${nest_srl}&order=turn&sort=asc` : '';
			let categories = await cox.$axios.$get(`/categories${params}`);
			if (!categories.success) throw categories.message;
			return {
				nest_srl,
				total: categories.success ? categories.data.total : 0,
				index: categories.success ? categories.data.index : null,
				error: null,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	},
	methods: {
		getDate(date)
		{
			return dates.getFormatDate(date, false);
		}
	}
}
</script>