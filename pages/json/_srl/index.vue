<template>
<article>
	<page-header
		module="json"
		:title="`JSON / ${data.name}`"
		:description="`${description}`"
	/>

	<div v-if="!!data.description" class="description">
		<p>{{data.description}}</p>
	</div>
	<pre class="json"><code>{{json}}</code></pre>

	<nav class="rg-nav">
		<dl>
			<dt>
				<button-basic label="Index" :to="`/json`" :inline="true"/>
			</dt>
			<dd>
				<button-basic label="Add" to="/json/add" color="key" :inline="true"/>
				<button-basic label="Edit" :to="`/json/${srl}/edit`" color="key" :inline="true"/>
				<button-basic label="Delete" :to="`/json/${srl}/delete`" color="key" :inline="true"/>
			</dd>
		</dl>
	</nav>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import ButtonBasic from '~/components/button/basic';
// library
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

export default {
	components: {
		PageHeader,
		ButtonBasic,
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	data()
	{
		return {
			srl: parseInt(this.$route.params.srl),
			error: '',
			processing: false,
		};
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/json/${srl}`);
			if (!res.success) throw res.message;
			return {
				data: res.data,
				description: `regdate: ${dates.getFormatDate(res.data.regdate, true)}`,
				json: JSON.stringify(res.data.json, null, 2),
				error: null,
			};
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : messages.error.service,
			});
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";

.description {
	margin: 1rem 0;
	> p {
		margin: 2px 0 0;
		font-size: .875rem;
		color: $color-blur;
	}
}
.json {
	padding: 1.5rem;
	border: 1px solid $color-content-line;
	background: #fff;
	font-size: .875rem;
	overflow: auto;
}
</style>