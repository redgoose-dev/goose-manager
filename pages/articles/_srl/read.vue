<template>
<article>
	<page-header
		module="articles"
		:title="article.title"
		:description="description"
		:prefix="prefix"/>

	<div v-html="article.content" class="rg-article-body"></div>

	<article v-if="files && files.length" class="files">
		<h1>Attachment files</h1>
		<ul>
			<li><a href="#">.attach files</a></li>
			<li><a href="#">.attach files</a></li>
			<li><a href="#">.attach files</a></li>
		</ul>
	</article>

	<nav class="rg-nav">
		<dl>
			<dt>
				<button-basic
					label="Index"
					:to="makeButtonUrl('index')"
					:inline="true"/>
			</dt>
			<dd>
				<button-basic
					v-if="nest_srl"
					label="Add"
					:to="makeButtonUrl('add')"
					:inline="true"/>
				<button-basic
					label="Edit"
					:to="makeButtonUrl('edit', srl)"
					:inline="true"
					color="key"/>
				<button-basic
					label="Delete"
					:to="makeButtonUrl('delete', srl)"
					:inline="true"
					color="gray"/>
			</dd>
		</dl>
	</nav>
</article>
</template>

<script>
import marked from 'marked';
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	computed: {
		description()
		{
			let str = '';
			str += `${this.printDate(this.article.regdate)}`;
			str += `, hit: ${this.article.hit}`;
			str += `, like: ${this.article.json.like || 0}`;
			return str;
		},
		prefix()
		{
			let str = '';
			str += this.nest.name;
			str += (this.article.category_name) ? ` / ${this.article.category_name}` : '';
			return str;
		}
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let nest_srl = cox.query.nest || null;
			let category_srl = cox.query.category || null;
			let page = cox.query.page || null;
			const article = await cox.$axios.$get(`/articles/${srl}?ext_field=category_name`);
			if (!article.success) throw article.message;

			// get nest, category data
			const [ nest, category, files ] = await Promise.all([
				cox.$axios.$get(`/nests/${article.data.nest_srl}`),
				article.data.category_srl && cox.$axios.$get(`/categories/${article.data.category_srl}`),
				cox.$axios.$get(`/files?article=${srl}`)
			]);
			if (!nest.success) throw nest.message;

			// convert content
			article.data.content = marked(article.data.content);

			return {
				srl,
				nest_srl,
				category_srl,
				page,
				article: article.data,
				nest: nest.data,
				category: (category && category.success) ? category.data : null,
				files: (files && files.success) ? files.data.index : null,
			};
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : messages.error.service,
			});
		}
	},
	methods: {
		printDate(date)
		{
			return dates.getFormatDate(date, true);
		},
		makeButtonUrl(type, srl=null)
		{
			let params = '';
			let query = {};
			switch(type)
			{
				case 'index':
					params = (this.nest_srl) ? `/${this.nest_srl}` : '';
					if (this.category_srl) query.category = this.category_srl;
					return `/articles${params}${text.serialize(query, true)}`;
				case 'add':
					if (this.category_srl) query.category = this.category_srl;
					return `/articles/${this.nest_srl}/add${text.serialize(query, true)}`;
				case 'edit':
					if (this.nest_srl) query.nest = this.nest_srl;
					if (this.category_srl) query.category = this.category_srl;
					return `/articles/${srl}/edit${text.serialize(query, true)}`;
				case 'delete':
					if (this.nest_srl) query.nest = this.nest_srl;
					if (this.category_srl) query.category = this.category_srl;
					return `/articles/${srl}/delete${text.serialize(query, true)}`;
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
.files {
	margin: 40px 0 -10px;
	padding: 20px;
	background: #eff0f2;
	h1 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}
	ul {
		margin: 1px -10px 0;
		padding: 0;
		list-style: none;
		font-size: 0;
	}
	li {
		display: inline-block;
	}
	a {
		display: inline-block;
		vertical-align: middle;
		padding: 4px 10px;
		font-size: 0.8125rem;
		color: $color-key;
		text-decoration: none;
	}
}
.rg-nav {
	margin-top: 40px;
}
</style>