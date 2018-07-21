<template>
<article>
	<page-header
		title="Apps"
		description="둥지를 그룹화시켜 관리하는 모듈입니다. 프로젝트 이름으로 사용하는것을 권장합니다."
		:links="{
			help: '/apps/help',
			setting: '/apps/setting'
		}"/>

	<div class="rg-index rg-index-card">
		<ul>
			<li>
				<item-index-card
					image="https://goose.redgoose.me/data/upload/original/201805/rg-20180511-000464.jpg"
					subject="fooo324wwwwwwwwwwwwwwwwwwwwwwww234oo"
					:metas="['Hit: 123', '0000-00-00']"
					:navs="[
						{ label: 'Edit', link: '/apps/edit/12' },
						{ label: 'Delete', link: '/apps/delete/12' }
					]"
				/>
			</li>
			<li>
				<item-index-card
					image="https://goose.redgoose.me/data/upload/original/201805/rg-20180511-000464.jpg"
					subject="fooofghoo"
					link="/"
					:metas="['Hit: 123', '0000-00-00']"
					:navs="[
						{ label: 'Edit', link: '/apps/edit/12' },
						{ label: 'Delete', link: '/apps/delete/12' }
					]"
				/>
			</li>
			<li>
				<item-index-card
					image="https://goose.redgoose.me/data/upload/original/201805/rg-20180511-000464.jpg"
					subject="foo2222ooo"
					link="/"
				/>
			</li>
			<li>
				<item-index-card
					subject="3333333"
					link="/"
				/>
			</li>
		</ul>
	</div>

	<nav class="rg-nav">
		<button-basic label="List nests" to="/nests" :inline="true"/>
		<button-basic label="Create App" to="/apps/create" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import ItemIndexCard from '~/components/contents/item-index-card';
import ButtonBasic from '~/components/button/basic';

export default {
	components: {
		PageHeader,
		ItemIndexCard,
		ButtonBasic,
	},
}
</script>