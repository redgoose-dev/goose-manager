<template>
<article>
	<page-header module="files"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else class="rg-index-thumbnail">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-thumbnail
					:href="`${url_api}/${item.loc}`"
					target="_blank"
					:subject="item.name"
					:image="`${url_api}/${item.loc}`"
					:metas="[
						`Type: ${item.type}`,
						`Size: ${getFileSize(item.size)}`,
					]"
					:metas2="[
						`article_srl: ${item.article_srl}`,
						`${getDate(item.regdate)}`
					]"/>
			</li>
		</ul>
	</div>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'ItemIndexThumbnail': () => import('~/components/contents/item-index-thumbnail'),
		'ItemIndexCard': () => import('~/components/contents/item-index-card'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Error': () => import('~/components/contents/error'),
	},
	validate(cox)
	{
		if (!cox.params.article_srl) return true;
		return /^\d+$/.test(cox.params.article_srl);
	},
	async asyncData(cox)
	{
		try
		{
			let article_srl = cox.params.article_srl ? parseInt(cox.params.article_srl) : null;
			let files = await cox.$axios.$get(`/files?order=srl&sort=desc${article_srl ? `&article=${article_srl}` : ''}`);
			if (!files.success) throw files.message;
			return {
				article_srl,
				url_api: cox.store.state.url_api,
				total: files.data.total,
				index: files.data.index,
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
		},
		getFileSize(size)
		{
			return text.getFileSize(size);
		}
	}
}
</script>