<template>
<article>
	<page-header module="categories"/>

	<error v-if="!!error" :message="error"/>
	<div v-else-if="!!categories && categories.length" class="rg-index rg-index-card">
		<ul>
			<li v-for="(item,key) in categories" :key="key">
				<div class="rg-item rg-item-card">
					<div>
						<p class="rg-item__subject">
							<strong>[{{item.srl}}] {{item.name}}</strong>
						</p>
						<p class="rg-item__metas">
							<span>Nest srl: {{item.nest_srl}}</span>
							<span>Date: {{getDate(item.regdate)}}</span>
						</p>
						<nav>
							<nuxt-link :to="`/categories/${item.srl}/edit`">Edit</nuxt-link>
							<nuxt-link :to="`/categories/${item.srl}/delete`">Delete</nuxt-link>
						</nav>
					</div>
				</div>
			</li>
		</ul>
	</div>
	<error v-else type="empty"/>

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
// components
import PageHeader from '~/components/contents/page-header';
import ItemIndexCard from '~/components/contents/item-index-card';
import ButtonBasic from '~/components/button/basic';
import Error from '~/components/contents/error';
// library
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
	components: {
		PageHeader,
		ItemIndexCard,
		ButtonBasic,
		Error,
	},
	validate(cox)
	{
		if (!cox.params.nest) return true;
		return /^\d+$/.test(cox.params.nest);
	},
	data()
	{
		return {
			nest_srl: this.$route.params.nest ? parseInt(this.$route.params.nest) : null,
			error: null,
		};
	},
	async asyncData(cox)
	{
		let nest_srl = parseInt(cox.params.nest) || null;
		try
		{
			let params = (nest_srl) ? `?nest=${nest_srl}&order=turn&sort=asc` : '';
			let categories = await cox.$axios.$get(`/categories${params}`);
			return {
				total: categories.success ? categories.data.total : 0,
				categories: categories.success ? categories.data.index : null,
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
		},
	}
}
</script>