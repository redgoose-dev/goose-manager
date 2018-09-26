<template>
<article>
	<page-header module="apps"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else class="rg-index-list">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-list
					:subject="item.name"
					:description="item.description"
					:metas="[
						`srl: ${item.srl}`,
						`ID: ${item.id}`,
						`Date: ${item.regdate}`]"
					:navs="[
						{ label: 'Edit', link: `/apps/${item.srl}/edit` },
						{ label: 'Delete', link: `/apps/${item.srl}/delete` }
					]"/>
			</li>
		</ul>
	</div>

	<nav class="rg-nav">
		<dl>
			<dt>
				<button-basic label="Nests" to="/nests" :inline="true"/>
			</dt>
			<dd>
				<button-basic label="Add App" to="/apps/add" :inline="true" color="key"/>
			</dd>
		</dl>
	</nav>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

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
			let res = await cox.$axios.$get('/apps?order=srl&sort=asc&unlimit=1');
			if (!(res && res.success && res.data.index && res.data.index.length)) throw messages.service.noItem;
			return {
				index: res.data.index.map((o) => {
					o.regdate = dates.getFormatDate(o.regdate, false);
					return o;
				}),
				error: '',
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	}
}
</script>