<template>
<article>
	<page-header title="Dashboard" description="welcome to goose manager" class="dashboard__header"/>

	<div class="dashboard__body">
		<!-- Articles -->
		<section v-if="articles && articles.length" class="dashboard__section">
			<header>
				<h3>Articles</h3>
			</header>
			<div class="rg-index-thumbnail">
				<ul>
					<li v-for="(item,key) in articles" :key="key">
						<item-index-thumbnail
							:image="(item.json && item.json.thumbnail) ? getImageUrl(item.json.thumbnail.path) : null"
							:link="getUrlForArticles('read', item.srl)"
							:title="item.title"
							:subject="item.title"
							:metas="[
								getArticleType(item.type),
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
		</section>
		<!-- // Articles -->

		<!-- Nests -->
		<section class="dashboard__section">
			<header>
				<h3>Nests</h3>
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
			<error v-else type="empty" class="dashboard__error"/>
		</section>
		<!-- // Nests -->

		<!-- Apps -->
		<section class="dashboard__section">
			<header>
				<h3>Apps</h3>
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
			<error v-else type="empty" class="dashboard__error"/>
		</section>
		<!-- // Apps -->

		<!-- JSON -->
		<section v-if="json && json.length" class="dashboard__section">
			<header>
				<h3>JSON</h3>
				<nav>
					<nuxt-link to="/json">
						<i class="material-icons">chevron_right</i>
					</nuxt-link>
				</nav>
			</header>
			<div class="rg-index-list">
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
		</section>
		<!-- // JSON -->
	</div>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as dates from '~/libs/dates';

export default {
	components: {
		'page-header': () => import('~/components/contents/page-header'),
		'index-articles': () => import('~/components/pages/articles/index-articles'),
		'item-index-list': () => import('~/components/contents/item-index-list'),
		'item-index-card': () => import('~/components/contents/item-index-card'),
		'item-index-thumbnail': () => import('~/components/contents/item-index-thumbnail'),
		'error': () => import('~/components/contents/error'),
	},
	async asyncData(cox)
	{
		const params = {
			articles: {
				field: 'srl,type,title,hit,star,regdate,category_srl,json',
				order: 'srl',
				sort: 'desc',
				size: 8,
				visible_type: 'all',
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
			},
		};

		try
		{
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
		getArticleType(type)
		{
			return text.getArticleType(type);
		},
	}
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
