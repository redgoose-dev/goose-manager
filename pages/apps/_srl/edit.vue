<template>
<article>
	<page-header module="apps" title="Edit app"/>
	<post type="edit" :srl="srl" :data="forms"/>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import Post from '~/components/pages/apps/post';
// library
import * as messages from '~/libs/messages';

export default {
	components: {
		PageHeader,
		Post
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/apps/${srl}`);
			if (!res.success) throw res.message;
			return {
				srl,
				forms: {
					id: res.data.id,
					name: res.data.name,
					description: res.data.description,
				}
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