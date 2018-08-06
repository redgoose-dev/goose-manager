<template>
<article>
	<page-header module="categories"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else class="rg-index-card">
		<draggable
			v-model="index"
			element="ul"
			@start="onStartSort"
			@end="onEndSort"
			:options="{ handle: '.move' }">
			<li v-for="(item,key) in index" :key="item.srl">
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
					]">
					<button v-if="!!nest_srl" type="button" title="Move item" class="move">
						<i class="material-icons">swap_horiz</i>
					</button>
				</item-index-card>
			</li>
		</draggable>
	</div>

	<nav v-if="nest_srl" class="rg-nav">
		<button-basic label="Nests" to="/nests" :inline="true"/>
		<button-basic label="Articles" :to="`/articles/${nest_srl}`" :inline="true"/>
		<button-basic label="Add Category" :to="`/categories/${nest_srl}/add`" :inline="true" color="key"/>
	</nav>
	<nav v-else class="rg-nav">
		<button-basic label="Nests" to="/nests" :inline="true"/>
	</nav>
</article>
</template>

<script>
import draggable from 'vuedraggable';
// library
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

let srls = null;

export default {
	components: {
		draggable,
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
			let url = (nest_srl) ? `/categories?nest=${nest_srl}&order=turn&sort=asc` : '/categories';
			let categories = await cox.$axios.$get(url);
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
			return {
				nest_srl,
				error: (typeof e === 'string') ? e : messages.error.service
			};
		}
	},
	methods: {
		getDate(date)
		{
			return dates.getFormatDate(date, false);
		},
		onStartSort()
		{
			srls = this.index.map((o, k) => (o.srl)).join(',');
		},
		async onEndSort(e)
		{
			if (!this.nest_srl) return;

			try
			{
				// make end srls
				let endSrls = this.index.map((o, k) => (o.srl)).join(',');

				// check srls
				if (srls === endSrls) return;

				// update sort
				const data = formData({
					nest_srl: this.nest_srl || null,
					srls: endSrls
				});
				let res = await this.$axios.$post('/categories/sort', data);
				if (!res.success) throw res.message;
				// TODO: 토스트 처리 필요함.
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				alert((e && typeof e === 'string') ? e : `Failed ${this.type} category.`);
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.move {
	display: block;
	margin: 0 -15px 0 0;
	padding: 0 20px;
	background: none;
	border: none;
	height: 100%;
	cursor: move;
	outline: none;
	font-size: 0;
}
.sortable-ghost {
	opacity: .1;
}
.rg-item-card {
	&:hover {
		&:after {
			box-shadow: 0 0 0;
		}
	}
}
</style>