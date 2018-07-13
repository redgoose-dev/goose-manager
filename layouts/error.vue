<template>
<article>
	<h1>error page</h1>
	<ul>
		<li>code: {{error.statusCode}}</li>
		<li>message: {{error.message}}</li>
	</ul>
</article>
</template>

<script>
export default {
	props: [ 'error' ],
	layout: 'blank',
}
</script>
