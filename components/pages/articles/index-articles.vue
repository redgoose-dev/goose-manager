<template>
<div class="articles-index">
	<loading v-if="loading"/>
	<div v-else-if="!!articles && articles.length" :class="`rg-index-${useSkin}`">
		<ul>
			<li v-for="(item,key) in articles" :key="key">
				<component
					v-bind:is="`item-index-${useSkin}`"
					:image="item.json.thumbnail ? getImageUrl(item.json.thumbnail.path) : null"
					:link="getUrl('read', item.srl)"
					:title="item.title"
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
		'ItemIndexList': () => import('~/components/contents/item-index-list'),
		'ItemIndexCard': () => import('~/components/contents/item-index-card'),
		'ItemIndexThumbnail': () => import('~/components/contents/item-index-thumbnail'),
		'Error': () => import('~/components/contents/error'),
	},
	props: {
		nest_srl: { type: [String,Number] },
		category_srl: { type: [String,Number] },
		page: { type: Number },
		total: { type: Number, default: 0 },
		articles: { type: Array, default: null },
		loading: { type: Boolean, default: false },
		skin: { type: String, default: 'thumbnail' }
	},
	computed: {
		useSkin()
		{
			switch(this.skin)
			{
				case 'list':
					return 'list';
				case 'card':
					return 'card';
				case 'thumbnail':
				default:
					return 'thumbnail';
			}
		}
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
		},
		getImageUrl(path)
		{
			if (!path) return null;
			return `${this.$store.state.url_api}/${path}`;
		}
	}
}
</script>