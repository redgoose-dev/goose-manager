<template>
	<header class="rg-page-header">
		<div class="rg-page-header__body">
			<h1 class="rg-page-header__title">{{title}}</h1>
			<p class="rg-page-header__description">{{description}}</p>
		</div>
		<nav class="rg-page-header__nav">
			.buttons
		</nav>
	</header>
</template>

<script>
export default {
	props: {
		title: { type: String, default: 'Page title' },
		description: { type: String, default: 'description text' },
	},
}
</script>