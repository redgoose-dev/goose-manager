<template>
<article>
	<page-header module="nests"/>

	<nav class="rg-nav">
		<button-basic label="Add nest" to="/nests/add" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import ButtonBasic from '~/components/button/basic';

export default {
	components: {
		PageHeader,
		ButtonBasic,
	},
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get('/nests?order=srl&sort=desc');
			console.log(res);
			// if (!(res && res.success)) throw messages.service.noItem;
			// return {
			// 	index: res.data.index.map((o) => {
			// 		o.srl = parseInt(o.srl);
			// 		o.regdate = dates.getFormatDate(o.regdate, false);
			// 		o.level = parseInt(o.level);
			// 		return o;
			// 	})
			// };
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	}
}
</script>