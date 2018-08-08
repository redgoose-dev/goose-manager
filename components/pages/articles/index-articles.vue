<template>
<div class="articles-index">
	<loading v-if="loading"/>
	<div v-else-if="!!articles && articles.length" class="rg-index-card">
		<ul>
			<li v-for="(item,key) in articles" :key="key">
				<item-index-card
					:link="getUrl('read', item.srl)"
					:subject="item.title"
					:metas="[
						item.category_name && `Category: ${item.category_name}`,
						`Hit: ${item.hit}`,
						`Date: ${getDate(item.regdate)}`
					]"
					:navs="[
						{ label: 'Edit', link: getUrl('edit', item.srl) },
						{ label: 'Delete', link: getUrl('delete', item.srl) }
					]"/>
			</li>
		</ul>
	</div>
	<error v-else type="empty"/>
</div>
</template>

<script>
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
	components: {
		'Loading': () => import('~/components/etc/loading'),
		'ItemIndexCard': () => import('~/components/contents/item-index-card'),
		'Error': () => import('~/components/contents/error'),
	},
	props: {
		nest_srl: { type: [String,Number] },
		category_srl: { type: [String,Number] },
		page: { type: Number },
		total: { type: Number, default: 0 },
		articles: { type: Array, default: null },
		loading: { type: Boolean, default: false },
	},
	methods: {
		getDate(date)
		{
			return dates.getFormatDate(date, false);
		},
		getUrl(type, srl)
		{
			let params = {};
			if (this.nest_srl) params.nest = this.nest_srl;
			if (this.category_srl) params.category = this.category_srl;
			if (this.page && this.page > 1) params.page = this.page;
			params = text.serialize(params, true);
			return `/articles/${srl}/${type}${params}`;
		}
	}
}
</script>