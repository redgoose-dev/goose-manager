<template>
	<header class="rg-page-header">
		<div class="rg-page-header__body">
			<h1 class="rg-page-header__title">{{title}}</h1>
			<p class="rg-page-header__description">{{description}}</p>
		</div>
		<nav v-if="links" class="rg-page-header__nav">
			<button-circle-icon v-if="links.help" :to="links.help" title="Help" name="help" color="key"/>
			<button-circle-icon v-if="links.setting" :to="links.setting" title="Setting" name="settings" color="gray"/>
		</nav>
	</header>
</template>

<script>
import ButtonCircleIcon from '~/components/button/circle-icon';

export default {
	components: {
		ButtonCircleIcon,
	},
	props: {
		title: { type: String, default: 'Page title' },
		description: { type: String, default: 'description text' },
		links: {
			help: { type: String },
			setting: { type: String },
		},
	},
}
</script>