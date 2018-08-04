<template>
<article>
	<page-header module="json" title="Edit JSON"/>
	<post type="edit" :srl="srl" :data="forms"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'Post': () => import('~/components/pages/json/post'),
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
			let res = await cox.$axios.$get(`/json/${srl}`);
			if (!res.success) throw res.message;
			return {
				srl,
				forms: {
					name: res.data.name,
					description: res.data.description,
					json: JSON.stringify(res.data.json, null, 2),
				},
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