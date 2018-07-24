<template>
<article>
	<page-header module="apps" title="Delete app"/>

	<form @submit="onSubmit" class="rg-form-delete">
		<input type="hidden" name="srl" :value="srl"/>
		<p class="rg-form-delete__message">
			<strong>{{data.name}}({{data.id}})</strong> App을 삭제하시겠습니까?
		</p>
		<p v-if="error" class="rg-form-error">{{error}}</p>
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
import PageHeader from '~/components/contents/page-header';
import ButtonBasic from '~/components/button/basic';
import * as messages from '../../../libs/messages';

export default {
	components: {
		PageHeader,
		ButtonBasic,
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get(`/apps/${cox.params.srl}`);
			if (!res.success) throw res.message;
			return {
				data: res.data,
				srl: cox.params.srl,
				error: '',
				processing: false,
			};
		}
		catch(e)
		{
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : message.error.service,
			});
		}
	},
	mounted()
	{
		if (this.$refs.button_submit)
		{
			this.$refs.button_submit.$el.focus();
		}
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
				this.$router.replace('/apps');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed delete app.`;
				this.processing = false;
			}
		}
	}
}
</script>