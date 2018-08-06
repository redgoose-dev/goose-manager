<template>
<div class="articles-index">
	<loading v-if="loading"/>
	<div v-else-if="!!articles && articles.length" class="rg-index-card">
		<ul>
			<li v-for="(item,key) in articles" :key="key">
				<item-index-card
					:link="`/articles/${item.srl}/read`"
					:subject="item.title"
					:metas="[
						item.category_name && `Category: ${item.category_name}`,
						`Hit: ${item.hit}`,
						`Date: ${getDate(item.regdate)}`
					]"
					:navs="[
						{ label: 'Edit', link: `/articles/${item.srl}/edit` },
						{ label: 'Delete', link: `/articles/${item.srl}/delete` }
					]"/>
			</li>
		</ul>
	</div>
	<error v-else type="empty"/>
</div>
</template>

<script>
import * as dates from '~/libs/dates';

export default {
	components: {
		'Loading': () => import('~/components/etc/loading'),
		'ItemIndexCard': () => import('~/components/contents/item-index-card'),
		'Error': () => import('~/components/contents/error'),
	},
	props: {
		total: { type: Number, default: 0 },
		articles: { type: Array, default: null },
		loading: { type: Boolean, default: false },
	},
	methods: {
		getDate(date)
		{
			return dates.getFormatDate(date, false);
		},
	}
}
</script>