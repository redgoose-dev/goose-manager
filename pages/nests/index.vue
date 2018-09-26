<template>
<article>
	<page-header module="nests"/>

	<error v-if="!!error" :message="error"/>
	<error v-else-if="!(index && index.length)" type="empty"/>
	<div v-else>
		<section v-for="(app,appKey) in index" :key="appKey" class="nest">
			<header>
				<h1>
					<span>{{app.name || 'No an app'}}</span>
					<em>{{app.count}}</em>
				</h1>
				<p v-if="!!app.description">{{app.description}}</p>
			</header>
			<div v-if="app.children && app.children.length" class="rg-index-card">
				<ul>
					<li v-for="(nest,nestKey) in app.children" :key="nestKey">
						<item-index-card
							:link="`/articles/${nest.srl}`"
							:subject="`${nest.name}(${nest.count_articles})`"
							:description="nest.description"
							:metas="[
								getDate(nest.regdate),
								`ID: ${nest.id}`,
							]"
							:navs="[
								{ label: 'Edit', link: `/nests/${nest.srl}/edit` },
								{ label: 'Delete', link: `/nests/${nest.srl}/delete` },
								!!parseInt(nest.json.useCategory) && { label: 'Category', link: `/categories/${nest.srl}` },
							]"/>
					</li>
				</ul>
			</div>
		</section>
	</div>

	<nav class="rg-nav">
		<dl>
			<dt>
				<button-basic label="Apps" to="/apps" :inline="true"/>
			</dt>
			<dd>
				<button-basic
					v-if="!error && (index && index.length)"
					label="Add Nest"
					to="/nests/add"
					:inline="true"
					color="key"/>
			</dd>
		</dl>
	</nav>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'ItemIndexCard': () => import('~/components/contents/item-index-card'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Error': () => import('~/components/contents/error'),
	},
	async asyncData(cox)
	{
		try
		{
			// get apps
			let res = await cox.$axios.$get('/manager/nests');
			if (!res.success) throw 'Failed get apps';

			return {
				index: res.data,
				error: '',
			};
		}
		catch(e)
		{
			return { error: (typeof e === 'string') ? e : messages.error.service };
		}
	},
	methods: {
		getDate: function(date)
		{
			return dates.getFormatDate(date, false);
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";

.nest {
	margin: 40px 0 0;
	&:first-child {
		margin-top: 0;
	}
	> header {
		h1 {
			margin: 0;
			font-family: $font-eng;
			font-size: 1.125rem;
			font-weight: 600;
			line-height: 1;
			em {
				padding-left: 0;
				font-style: normal;
				&:before {
					content: '(';
				}
				&:after {
					content: ')';
				}
			}
		}
		p {
			margin: 5px 0 0;
			font-size: .75rem;
			color: $color-blur;
			word-break:keep-all;
			overflow-wrap:break-word;
		}
	}
	[class^='rg-index'] {
		margin-top: 12px;
	}
	.rg-index-error {
		margin-top: 12px;
	}
}
</style>