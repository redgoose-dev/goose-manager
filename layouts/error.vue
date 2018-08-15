<template>
<article class="error">
	<figure>
		<img src="/images/img-error@2x.png" alt="service error"/>
	</figure>
	<h1 class="title">
		<img src="/images/txt-error.svg" :alt="`Service error / ${error.statusCode}`"/>
	</h1>
	<p class="description">{{error.message}}</p>
	<nav class="nav">
		<button-basic
			label="Go back"
			onClick="history.back()"
			color="key"
			:inline="true"/>
	</nav>
</article>
</template>

<script>
export default {
	components: {
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	props: [ 'error' ],
}
</script>
<style lang="scss" scoped>
@import "../assets/scss/variables";
.error {
	padding: 0 0 50px;
	figure {
		margin: 0;
		padding: 30px 0 0;
		img {
			display: block;
			width: 363px;
			margin: 0 auto;
		}
	}
}
.title {
	margin: 40px 0 0;
	img {
		display: block;
		margin: 0 auto;
	}
}
.description {
	margin: 10px 0 0;
	text-align: center;
	font-size: 1.25rem;
	color: $color-blur;
}
.nav {
	margin: 30px 0 0;
	text-align: center;
}
</style>