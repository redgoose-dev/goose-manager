<template>
<article>
	<page-header module="json"/>

	<div v-if="index && index.length" class="rg-index rg-index-list">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-list
					:subject="item.name"
					:link="`/json/${item.srl}`"
					:metas="[
						`srl: ${item.srl}`,
						`Date: ${item.regdate}`
					]"
					:navs="[
						{ label: 'Edit', link: `/json/${item.srl}/edit` },
						{ label: 'Delete', link: `/json/${item.srl}/delete` },
					]"/>
			</li>
		</ul>
	</div>
	<div v-else class="rg-index-error">
		{{error}}
	</div>

	<nav class="rg-nav">
		<button-basic label="Add JSON" to="/json/add" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import ItemIndexList from '~/components/contents/item-index-list';
import ButtonBasic from '~/components/button/basic';
import * as messages from '../../libs/messages';
import * as dates from '../../libs/dates';

export default {
	components: {
		PageHeader,
		ItemIndexList,
		ButtonBasic,
	},
	data()
	{
		return {
			index: null,
			error: messages.error.service
		};
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
				})
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	}
}
</script>