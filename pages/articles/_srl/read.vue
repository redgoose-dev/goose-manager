<template>
<article>
	<page-header module="articles" title="Add article"/>

	<div>smdipgdmsgp</div>
</article>
</template>

<script>

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
}
</script>