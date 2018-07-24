<template>
<article>
	<page-header module="users"/>

	<div v-if="index && index.length" class="rg-index rg-index-list">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-list
					:subject="item.email"
					:metas="[
						`Name: ${item.name}`,
						`Date: ${item.regdate}`,
						`Level: ${item.level}`
					]"
					:navs="[
						{ label: 'Edit', link: `/users/${item.srl}/edit` },
						{ label: 'Delete', link: `/users/${item.srl}/delete` },
						{ label: 'Change password', link: `/users/${item.srl}/change-password` },
					]"/>
			</li>
		</ul>
	</div>
	<div v-else class="rg-index-error">
		{{error}}
	</div>

	<nav class="rg-nav">
		<button-basic label="Index" to="/users" :inline="true"/>
		<button-basic label="Add user" to="/users/add" :inline="true" color="key"/>
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
	middleware: ['check-admin'],
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
			let res = await cox.$axios.$get('/users?order=srl&sort=desc');
			if (!(res && res.success)) throw messages.service.noItem;
			return {
				index: res.data.index.map((o) => {
					o.srl = parseInt(o.srl);
					o.regdate = dates.getFormatDate(o.regdate, false);
					o.level = parseInt(o.level);
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