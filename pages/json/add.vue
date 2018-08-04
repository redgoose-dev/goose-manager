<template>
<article>
	<page-header module="json" title="Add JSON"/>
	<post type="add"/>
</article>
</template>

<script>
export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'Post': () => import('~/components/pages/json/post'),
	}
}
</script>