<template>
<article>
	<page-header
		title="Dashboard"
		description="welcome to goose manager"/>

	<section class="section section-first">
		<header>
			<h1>Articles</h1>
		</header>
		<div v-if="articles && articles.length" :class="`rg-index-thumbnail`">
			<ul>
				<li v-for="(item,key) in articles" :key="key">
					<item-index-thumbnail
						:image="(item.json && item.json.thumbnail) ? getImageUrl(item.json.thumbnail.path) : null"
						:link="getUrlForArticles('read', item.srl)"
						:title="item.title"
						:subject="item.title"
						:metas="[
							getDate(item.regdate),
							item.category_name,
							`Hit: ${item.hit}`,
							`Like: ${item.star}`
						]"
						:navs="[
							{ label: 'Edit', link: getUrlForArticles('edit', item.srl) },
							{ label: 'Delete', link: getUrlForArticles('delete', item.srl) }
						]"/>
				</li>
			</ul>
		</div>
		<error v-else type="empty" class="error"/>
	</section>

	<section class="section">
		<header>
			<h1>Nests</h1>
			<nav>
				<nuxt-link to="/nests">
					<i class="material-icons">chevron_right</i>
				</nuxt-link>
			</nav>
		</header>
		<div v-if="nests && nests.length" class="rg-index-card">
			<ul>
				<li v-for="(nest,nestKey) in nests" :key="nestKey">
					<item-index-card
						:link="`/articles/${nest.srl}`"
						:subject="nest.name"
						:description="nest.description"
						:metas="[
							`srl: ${nest.srl}`,
							`id: ${nest.id}`,
							getDate(nest.regdate),
						]"
						:navs="[
							{ label: 'Edit', link: `/nests/${nest.srl}/edit` },
							{ label: 'Delete', link: `/nests/${nest.srl}/delete` },
							!!parseInt(nest.json.useCategory) && { label: 'Category', link: `/categories/${nest.srl}` },
						]"/>
				</li>
			</ul>
		</div>
		<error v-else type="empty" class="error"/>
	</section>

	<section class="section">
		<header>
			<h1>Apps</h1>
			<nav>
				<nuxt-link to="/apps">
					<i class="material-icons">chevron_right</i>
				</nuxt-link>
			</nav>
		</header>
		<div v-if="apps && apps.length" class="rg-index-card">
			<ul>
				<li v-for="(app,appKey) in apps" :key="appKey">
					<item-index-card
						:subject="app.name"
						:description="app.description"
						:metas="[
							`srl: ${app.srl}`,
							`id: ${app.id}`,
							getDate(app.regdate),
						]"
						:navs="[
							{ label: 'Edit', link: `/apps/${app.srl}/edit` },
							{ label: 'Delete', link: `/apps/${app.srl}/delete` },
						]"/>
				</li>
			</ul>
		</div>
		<error v-else type="empty" class="error"/>
	</section>

	<section class="section">
		<header>
			<h1>JSON</h1>
			<nav>
				<nuxt-link to="/json">
					<i class="material-icons">chevron_right</i>
				</nuxt-link>
			</nav>
		</header>
		<div v-if="json && json.length" class="rg-index-list">
			<ul>
				<li v-for="(jsonItem,jsonKey) in json" :key="jsonKey">
					<item-index-list
						:link="`/json/${jsonItem.srl}`"
						:subject="jsonItem.name"
						:description="jsonItem.description"
						:metas="[
							`srl: ${jsonItem.srl}`,
							getDate(jsonItem.regdate),
						]"
						:navs="[
							{ label: 'Edit', link: `/json/${jsonItem.srl}/edit` },
							{ label: 'Delete', link: `/json/${jsonItem.srl}/delete` },
						]"/>
				</li>
			</ul>
		</div>
		<error v-else type="empty" class="error"/>
	</section>

</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as dates from '~/libs/dates';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'IndexArticles': () => import('~/components/pages/articles/index-articles'),
		'ItemIndexList': () => import('~/components/contents/item-index-list'),
		'ItemIndexCard': () => import('~/components/contents/item-index-card'),
		'ItemIndexThumbnail': () => import('~/components/contents/item-index-thumbnail'),
		'Error': () => import('~/components/contents/error'),
	},
	async asyncData(cox)
	{
		const params = {
			articles: {
				field: 'srl,title,hit,star,regdate,category_srl,json',
				order: 'srl',
				sort: 'desc',
				size: 8,
			},
			nests: {
				field: 'srl,id,name,description,regdate,json',
				order: 'srl',
				sort: 'desc',
				size: 6,
			},
			apps: {
				field: 'srl,id,name,description,regdate',
				order: 'srl',
				sort: 'desc',
				size: 6,
			},
			json: {
				field: 'srl,name,description,regdate',
				order: 'srl',
				sort: 'desc',
				size: 3,
			}
		};

		try
		{
			let data = {};
			const [ articles, nests, apps, json ] = await Promise.all([
				cox.$axios.$get(`/articles${text.serialize(params.articles, true)}`),
				cox.$axios.$get(`/nests${text.serialize(params.nests, true)}`),
				cox.$axios.$get(`/apps${text.serialize(params.apps, true)}`),
				cox.$axios.$get(`/json${text.serialize(params.json, true)}`),
			]);
			return {
				articles: articles.success ? articles.data.index : null,
				nests: nests.success ? nests.data.index : null,
				apps: apps.success ? apps.data.index : null,
				json: json.success ? json.data.index : null,
			};
		}
		catch(e)
		{
			return {
				articles: null,
				nests: null,
				apps: null,
				json: null,
			};
		}
	},
	methods: {
		getDate: function(date)
		{
			return dates.getFormatDate(date, false);
		},
		getImageUrl(path)
		{
			if (!path) return null;
			return `${this.$store.state.url_api}/${path}`;
		},
		getUrlForArticles(type, srl)
		{
			let params = {};
			if (this.nest_srl) params.nest = this.nest_srl;
			if (this.category_srl) params.category = this.category_srl;
			if (this.page && this.page > 1) params.page = this.page;
			params.home = 1;
			params = text.serialize(params, true);
			return `/articles/${srl}/${type}${params}`;
		},
	}
};
</script>
<style lang="scss" scoped>
.section {
	margin: 50px 0 0;
	&-first {
		margin-top: 0;
	}
	header {
		display: flex;
		align-items: center;
		margin: 0 0 15px;
		h1 {
			flex: 1;
			margin: 0;
			padding: 0 0 0 2px;
			font-size: 1.5rem;
			font-weight: 600;
			line-height: 1;
		}
		nav {
			margin-right: 0px;
			a {
				display: block;
				padding: 5px;
				font-size: 0;
			}
		}
	}
}
.error {
	padding: 30px 0;
}
</style>