<template>
<article>
	<page-header module="json" title="Add JSON"/>
	<post type="add"/>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import Post from '~/components/pages/json/post';

export default {
	components: {
		PageHeader,
		Post,
	}
}
</script>