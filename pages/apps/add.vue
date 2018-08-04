<template>
<article>
	<page-header module="apps" title="Add app"/>
	<post type="add"/>
</article>
</template>

<script>
export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'Post': () => import('~/components/pages/apps/post'),
	}
}
</script>