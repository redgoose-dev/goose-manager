<template>
<article>
	<page-header module="json" title="Delete JSON"/>

	<form @submit="onSubmit" class="rg-form-delete">
		<input type="hidden" name="srl" :value="srl"/>
		<div class="rg-form-delete__message">
			<p>다음 `JSON`을 삭제하시겠습니까?</p>
			<p>
				<strong>{{data.name}}</strong>
			</p>
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
				:label="!processing ? 'Delete JSON' : null"
				:inline="true"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</article>
</template>

<script>
import * as messages from '../../../libs/messages';

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
			let res = await cox.$axios.$get(`/json/${srl}?field=name`);
			if (!res.success) throw res.message;
			return {
				srl,
				processing: false,
				data: res.data,
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
		const { $refs } = this;
		if ($refs.button_submit)
		{
			$refs.button_submit.$el.focus();
		}
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			try
			{
				this.processing = true;
				let res = await this.$axios.$post(`/json/${this.srl}/delete`);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.replace('/json');
			}
			catch(e)
			{
				this.processing = false;
				if (e === messages.error.service) e = null;
				alert((e && typeof e === 'string') ? e : `Failed delete JSON.`)
			}
		}
	}
}
</script>