<template>
	<header class="rg-page-header">
		<div class="rg-page-header__body">
			<small v-if="!!prefix" class="rg-page-header__prefix">{{prefix}}</small>
			<h2 class="rg-page-header__title">{{title || messages.title}}</h2>
			<p class="rg-page-header__description">{{messages.description}}</p>
		</div>
		<!--<nav v-if="messages.links" class="rg-page-header__nav">-->
			<!--<button-circle-icon-->
				<!--v-if="messages.links.help"-->
				<!--:to="messages.links.help"-->
				<!--title="Help"-->
				<!--name="help"-->
				<!--color="key"/>-->
			<!--<button-circle-icon-->
				<!--v-if="messages.links.setting"-->
				<!--:to="messages.links.setting"-->
				<!--title="Setting"-->
				<!--name="settings"-->
				<!--color="gray"/>-->
		<!--</nav>-->
	</header>
</template>

<script>
export default {
	components: {
		'ButtonCircleIcon': () => import('~/components/button/circle-icon'),
	},
	props: {
		module: { type: String },
		title: { type: String },
		description: { type: String },
		prefix: { type: String },
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
				case 'articles':
					return {
						title: this.title || 'Articles',
						description: this.description || '글 목록을 관리하는 모듈입니다.',
						links: {
							help: '/articles/help',
							setting: '/articles/setting',
							...this.links,
						}
					};
				case 'categories':
					return {
						title: this.title || 'Categories',
						description: this.description || '`Articles`의 분류를 관리하는 모듈입니다.',
						links: {
							help: '/categories/help',
							setting: '/categories/setting',
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
				case 'users':
					return {
						title: this.title || 'Users',
						description: this.description || '사용자 목록을 관리하는 모듈입니다.',
						links: {
							help: '/users/help',
							setting: '/users/setting',
							...this.links,
						}
					};
				case 'json':
					return {
						title: this.title || 'JSON',
						description: this.description || '`JSON`데이터를 관리하는 모듈입니다.',
						links: {
							help: '/json/help',
							setting: '/json/setting',
							...this.links,
						}
					};
				case 'files':
					return {
						title: this.title || 'Files',
						description: this.description || '첨부된 파일들의 목록입니다.',
						links: {
							help: '/files/help',
							setting: '/files/setting',
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