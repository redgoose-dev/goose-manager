<template>
<article>
	<page-header module="categories"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(computedIndex && computedIndex.length)" type="empty"/>
	<div v-else class="rg-index-card">
		<draggable
			v-model="categories"
			tag="ul"
			@start="onStartSort"
			@end="onEndSort"
			handle=".move">
			<li v-for="(item,key) in computedIndex" :key="item.srl">
				<item-index-card
					:subject="`[${item.srl}] ${item.name}`"
					:metas="[
						`Nest srl: ${item.nest_srl}`,
						`Date: ${getDate(item.regdate)}`
					]"
					:navs="[
						{
							label: 'Edit',
							link: `/categories/${item.srl}/edit${item.nest_srl ? `?nest=${item.nest_srl}` : ''}`
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
		<dl>
			<dt>
				<button-basic label="Nests" to="/nests" :inline="true"/>
				<button-basic label="Articles" :to="`/articles/${nest_srl}`" :inline="true"/>
			</dt>
			<dd>
				<button-basic label="Add Category" :to="`/categories/${nest_srl}/add`" :inline="true" color="key"/>
			</dd>
		</dl>
	</nav>
	<nav v-else class="rg-nav">
		<dl>
			<dt>
				<button-basic label="Nests" to="/nests" :inline="true"/>
			</dt>
		</dl>
	</nav>
</article>
</template>

<script>
import draggable from 'vuedraggable';
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

let srls = null;

export default {
	components: {
		draggable,
		'page-header': () => import('~/components/contents/page-header'),
		'item-index-card': () => import('~/components/contents/item-index-card'),
		'button-basic': () => import('~/components/button/basic'),
		'error': () => import('~/components/contents/error'),
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
				categories: categories.success ? categories.data.index : null,
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
	computed: {
		computedIndex()
		{
			return !!this.categories && this.categories.length ? this.categories : [];
		},
	},
	methods: {
		getDate(date)
		{
			return dates.getFormatDate(date, false);
		},
		onStartSort()
		{
			srls = this.categories.map((o, k) => (o.srl)).join(',');
		},
		async onEndSort(e)
		{
			if (!this.nest_srl) return;

			try
			{
				// make end srls
				let endSrls = this.categories.map((o, k) => (o.srl)).join(',');

				// check srls
				if (srls === endSrls) return;

				// update sort
				const data = formData({
					nest_srl: this.nest_srl || null,
					srls: endSrls
				});
				let res = await this.$axios.$post('/categories/sort', data);
				if (!res.success) throw res.message;
				this.$toast.add({
					message: 'Success change sort.',
					color: 'success',
				});
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.$toast.add({
					message: (e && typeof e === 'string') ? e : `Failed ${this.type} category.`,
					color: 'error',
				});
			}
		}
	}
}
</script>

<style src="./index.scss" lang="scss" scoped></style>