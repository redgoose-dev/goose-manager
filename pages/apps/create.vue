<template>
<article>
	<page-header module="apps" title="Create app"/>
	<post type="create"/>
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