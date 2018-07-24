<template>
<article>
	<page-header module="users" title="Edit user"/>
	<edit type="user" :srl="srl" :data="data"/>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import Edit from '~/components/pages/users/edit';
import * as messages from '../../../libs/messages';

export default {
	components: {
		PageHeader,
		Edit,
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get(`/users/${cox.params.srl}`);
			if (!res.success) throw res.message;

			return {
				srl: parseInt(cox.params.srl),
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