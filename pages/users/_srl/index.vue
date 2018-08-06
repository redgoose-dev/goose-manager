<template>
<article>
	<page-header module="users" :title="`User / ${data.name}`"/>

	<div class="rg-index-items">
		<dl>
			<dt>srl number</dt>
			<dd>{{data.srl}}</dd>
		</dl>
		<dl>
			<dt>E-mail</dt>
			<dd>{{data.email}}</dd>
		</dl>
		<dl>
			<dt>Name</dt>
			<dd>{{data.name}}</dd>
		</dl>
		<dl>
			<dt>Admin</dt>
			<dd>{{parseInt(data.admin) === 2 ? 'Yes' : 'No'}}</dd>
		</dl>
		<dl>
			<dt>Register date</dt>
			<dd>{{getDate(data.regdate)}}</dd>
		</dl>
	</div>

	<nav class="rg-nav">
		<button-basic label="Users" to="/users" :inline="true"/>
		<button-basic label="Edit" :to="`/users/${srl}/edit`" color="key" :inline="true"/>
	</nav>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	async asyncData(cox)
	{
		try
		{
			const srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/users/${srl}`);
			if (!res.success) throw res.message;

			return {
				srl,
				data: res.data,
			};
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : messages.error.service,
			});
		}
	},
	methods: {
		getDate(date)
		{
			return dates.getFormatDate(date, true);
		}
	}
}
</script>