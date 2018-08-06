<template>
<article>
	<page-header module="users"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else class="rg-index-list">
		<ul>
			<li v-for="(item,key) in index" :key="key">
				<item-index-list
					:link="`/users/${item.srl}`"
					:subject="item.email"
					:metas="[
						`Name: ${item.name}`,
						`Date: ${item.regdate}`,
						`Admin: ${item.admin ? 'Yes' : 'No'}`
					]"
					:navs="[
						{ label: 'Edit', link: `/users/${item.srl}/edit` },
						{ label: 'Delete', link: `/users/${item.srl}/delete` },
						{ label: 'Change password', link: `/users/${item.srl}/change-password` },
					]"/>
			</li>
		</ul>
	</div>

	<nav class="rg-nav">
		<button-basic label="Add User" to="/users/add" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
	middleware: ['check-admin'],
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
			let res = await cox.$axios.$get('/users?order=srl&sort=desc');
			if (!(res && res.success)) throw messages.service.noItem;
			return {
				index: res.data.index.map((o) => {
					o.srl = parseInt(o.srl);
					o.regdate = dates.getFormatDate(o.regdate, false);
					o.admin = parseInt(o.admin) === 2;
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