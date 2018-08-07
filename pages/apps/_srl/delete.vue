<template>
<article>
	<page-header module="apps" title="Delete app"/>

	<form @submit="onSubmit" class="rg-form-delete">
		<input type="hidden" name="srl" :value="srl"/>
		<div class="rg-form-delete__message">
			<p>
				다음 `App`을 삭제하시겠습니까?<br/>
				이것을 삭제하면 하위의 `Nest`, `Article`, `Category`, `File`의 데이터가 삭제됩니다.
			</p>
			<p><strong>[{{forms.id}}] {{forms.name}}</strong></p>
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
			const srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/apps/${srl}`);
			if (!res.success) throw res.message;
			return {
				srl: parseInt(this.$route.params.srl),
				processing: false,
				forms: {
					id: res.data.id,
					name: res.data.name,
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
				let res = await this.$axios.$post(`/apps/${this.srl}/delete`);
				if (!res.success) throw res.message;
				this.processing = false;

				// redirect to index
				this.$router.replace('/apps');
			}
			catch(e)
			{
				this.processing = false;
				if (e === messages.error.service) e = null;
				alert((e && typeof e === 'string') ? e : `Failed delete App.`);
			}
		}
	}
}
</script>