<template>
<article>
	<page-header module="users" title="Account"/>
	<edit type="account" :srl="srl" :data="data"/>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import Edit from '~/components/pages/users/edit';
import * as messages from '../../libs/messages';

export default {
	components: {
		PageHeader,
		Edit,
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.store.state.authUser.srl);
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
	}
}
</script>