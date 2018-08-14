<template>
<article>
	<page-header module="json"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else class="rg-index-list">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-list
					:subject="item.name"
					:description="item.description"
					:link="`/json/${item.srl}`"
					:metas="[
						`srl: ${item.srl}`,
						`regdate: ${item.regdate}`
					]"
					:navs="[
						{ label: 'Edit', link: `/json/${item.srl}/edit` },
						{ label: 'Delete', link: `/json/${item.srl}/delete` },
					]"/>
			</li>
		</ul>
	</div>

	<nav class="rg-nav">
		<button-basic label="Add JSON" to="/json/add" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
import * as messages from '../../libs/messages';
import * as dates from '../../libs/dates';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'ItemIndexList': () => import('~/components/contents/item-index-list'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Error': () => import('~/components/contents/error'),
	},
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get('/json?order=srl&sort=desc');
			if (!(res && res.success)) throw messages.service.noItem;
			return {
				index: res.data.index.map((o) => {
					o.srl = parseInt(o.srl);
					o.regdate = dates.getFormatDate(o.regdate, false);
					return o;
				}),
				error: null,
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	}
}
</script>