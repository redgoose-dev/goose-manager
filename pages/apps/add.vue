<template>
<article>
	<page-header module="apps" title="Add app"/>
	<post type="post"/>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import Post from '~/components/pages/apps/post';

export default {
	components: {
		PageHeader,
		Post,
	},
}
</script>