<template>
<article>
	<page-header module="nests"/>

	<div v-if="index && index.length && !error">
		<section v-for="(app,appKey) in index" :key="appKey" class="nest">
			<header>
				<h1>
					<span>{{app.name || 'No an app'}}</span>
					<em>{{app.count}}</em>
				</h1>
				<p v-if="!!app.description">{{app.description}}</p>
			</header>
			<div v-if="app.children && app.children.length" class="rg-index rg-index-card">
				<ul>
					<li v-for="(nest,nestKey) in app.children" :key="nestKey">
						<item-index-card
							:link="`/articles/${nest.srl}`"
							:subject="nest.name"
							:description="nest.description"
							:metas="[
								`ID: ${nest.id}`,
								`Date: ${getDate(nest.regdate)}`
							]"
							:navs="[
								{ label: 'Edit', link: `/nests/${nest.srl}/edit` },
								{ label: 'Delete', link: `/nests/${nest.srl}/delete` },
								{ label: 'Category', link: `/categories/${nest.srl}` },
							]"/>
					</li>
				</ul>
			</div>
		</section>
	</div>
	<div v-else class="rg-index-error">
		{{error}}
	</div>

	<nav class="rg-nav">
		<button-basic label="Apps" to="/apps" :inline="true"/>
		<button-basic label="Add Nest" to="/nests/add" :inline="true" color="key"/>
	</nav>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import ItemIndexCard from '~/components/contents/item-index-card';
import ButtonBasic from '~/components/button/basic';
import * as messages from '../../libs/messages';
import * as dates from '../../libs/dates';

export default {
	components: {
		PageHeader,
		ItemIndexCard,
		ButtonBasic,
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
				error: null,
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
			font-size: 1rem;
			font-weight: 600;
			line-height: 1;
			em {
				padding-left: 3px;
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
			margin: 3px 0 0;
			font-size: .6875rem;
			color: $color-blur;
			word-break:keep-all;
			overflow-wrap:break-word;
		}
	}
	.rg-index {
		margin-top: 12px;
	}
	.rg-index-error {
		margin-top: 12px;
	}
}
</style>