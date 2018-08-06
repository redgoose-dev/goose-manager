<template>
<article>
	<page-header module="articles" title="Edit article"/>

	<div>s,dp]gsdgp</div>
</article>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'Post': () => import('~/components/pages/articles/post'),
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	async asyncData(cox)
	{
		const srl = parseInt(cox.params.srl);
		const nest_srl = cox.query.nest;
		console.log(nest_srl);

		try
		{
			console.log(srl);
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : messages.error.service,
			});
		}

		return {
			srl,
			nest_srl,
		};
	}
}
</script>