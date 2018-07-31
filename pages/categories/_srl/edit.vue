<template>
<article>
	<page-header module="categories" title="Edit category"/>
	<post type="edit" :srl="srl" :nest_srl="nest_srl" :data="forms"/>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import Post from '~/components/pages/categories/post';
// library
import * as messages from '~/libs/messages';

export default {
	components: {
		PageHeader,
		Post,
	},
	validate(cox)
	{
		// check srl
		if (!(cox.params.srl && /^\d+$/.test(cox.params.srl))) return false;
		// check nest_srl
		if (!(cox.query.nest && /^\d+$/.test(cox.query.nest))) return false;
		return true;
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let nest_srl = parseInt(cox.query.nest);
			let res = await cox.$axios.$get(`/categories/${srl}`);
			return {
				srl,
				nest_srl,
				forms: {
					name: res.data.name,
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