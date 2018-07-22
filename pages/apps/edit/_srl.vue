<template>
<article>
	<page-header module="apps" title="Edit app"/>
	<post type="edit" :srl="srl" :data="data"/>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import Post from '~/components/pages/apps/post';
import * as message from '../../../libs/messages';

export default {
	components: {
		PageHeader,
		Post,
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get(`/apps/${cox.params.srl}`);
			if (!res.success) throw res.message;
			return {
				data: res.data,
				srl: cox.params.srl,
			};
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : message.error.service,
			});
		}
	}
}
</script>