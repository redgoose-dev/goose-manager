<template>
<article>
	<page-header module="apps"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else class="rg-index-card">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-card
					:subject="item.name"
					:description="item.description"
					:metas="[`ID: ${item.id}`, `Date: ${item.regdate}`]"
					:navs="[
						{ label: 'Edit', link: `/apps/${item.srl}/edit` },
						{ label: 'Delete', link: `/apps/${item.srl}/delete` }
					]"/>
			</li>
		</ul>
	</div>

	<nav class="rg-nav">
		<button-basic label="Nests" to="/nests" :inline="true"/>
		<button-basic label="Add App" to="/apps/add" :inline="true" color="key"/>
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
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get('/apps?order=srl&sort=desc&unlimit=1');
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