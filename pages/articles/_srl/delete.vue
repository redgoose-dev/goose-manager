<template>
<article>
	<page-header module="articles" title="Delete article"/>

	<form @submit="onSubmit" class="rg-form-delete">
		<input type="hidden" name="srl" :value="srl"/>
		<div class="rg-form-delete__message">
			<p>
				다음 `Article`을 삭제하시겠습니까?<br/>
				이것을 삭제하면 하위의 `File`의 데이터가 삭제됩니다.
			</p>
			<p><strong>{{forms.title}}</strong></p>
		</div>
		<nav class="rg-nav rg-form-delete__nav">
			<button-basic
				type="button"
				label="Back"
				onClick="history.back()"
				:inline="true"/>
			<button-basic
				type="submit"
				ref="button_submit"
				color="key"
				:label="!processing ? 'Delete' : null"
				:inline="true"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
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
	async asyncData(cox)
	{
		try
		{
			const srl = cox.params.srl;
			const nest_srl = cox.query.nest || null;
			const category_srl = cox.query.category || null;

			let res = await cox.$axios.$get(`/articles/${srl}`);
			if (!res.success) throw res.message;
			return {
				srl,
				nest_srl,
				category_srl,
				processing: false,
				forms: {
					title: res.data.title,
				}
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
	mounted()
	{
		setTimeout(() => this.$refs.button_submit.$el.focus(), 100);
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			try
			{
				this.processing = true;
				let res = await this.$axios.$post(`/articles/${this.srl}/delete`);
				if (!res.success) throw res.message;
				this.processing = false;

				// redirect to index
				let params = {};
				if (this.category_srl) params.category = this.category_srl;
				let url = `/articles${this.nest_srl ? `/${this.nest_srl}` : ''}`;
				this.$router.replace(url + text.serialize(params, true));
			}
			catch(e)
			{
				this.processing = false;
				if (e === messages.error.service) e = null;
				alert((e && typeof e === 'string') ? e : `Failed delete Article.`);
			}
		}
	}
}
</script>