<template>
<article>
	<page-header module="nests" title="Add nest"/>
	<post/>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import Post from '~/components/pages/nests/post';

export default {
	components: {
		PageHeader,
		Post,
	}
}
</script>