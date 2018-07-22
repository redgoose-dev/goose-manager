<template>
	<header class="rg-page-header">
		<div class="rg-page-header__body">
			<h1 class="rg-page-header__title">{{messages.title}}</h1>
			<p class="rg-page-header__description">{{messages.description}}</p>
		</div>
		<nav v-if="messages.links" class="rg-page-header__nav">
			<button-circle-icon
				v-if="messages.links.help"
				:to="messages.links.help"
				title="Help"
				name="help"
				color="key"/>
			<button-circle-icon
				v-if="messages.links.setting"
				:to="messages.links.setting"
				title="Setting"
				name="settings"
				color="gray"/>
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
		module: { type: String },
		title: { type: String },
		description: { type: String },
		links: {
			help: { type: String },
			setting: { type: String },
		},
	},
	computed: {
		messages: function()
		{
			switch(this.module)
			{
				case 'apps':
					return {
						title: this.title || 'Apps',
						description: this.description || '둥지를 그룹화시켜 관리하는 모듈입니다. 프로젝트 이름으로 사용하는것을 권장합니다.',
						links: {
							help: '/apps/help',
							setting: '/apps/setting',
							...this.links,
						}
					};
				case 'nests':
					return {
						title: this.title || 'Nests',
						description: this.description || '둥지를 관리하는 모듈입니다. 둥지는 `Article`모듈의 그룹입니다.',
						links: {
							help: '/nests/help',
							setting: '/nests/setting',
							...this.links,
						}
					};
				default:
					return {
						title: this.title,
						description: this.description,
						links: this.links,
					};
			}
		}
	}
}
</script>