<template>
<article>
	<page-header module="apps" title="Delete app"/>

	<form @submit="onSubmit" class="rg-form-delete">
		<input type="hidden" name="srl" :value="srl"/>
		<div class="rg-form-delete__message">
			<p>다음 App을 삭제하시겠습니까?</p>
			<p>
				<strong>{{forms.name}} <em>{{forms.id}}</em></strong>
			</p>
		</div>
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
				:label="!processing ? 'Delete App' : null"
				:inline="true"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import ButtonBasic from '~/components/button/basic';
// library
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
	data()
	{
		return {
			srl: parseInt(this.$route.params.srl),
			error: null,
			processing: false,
		};
	},
	async asyncData(cox)
	{
		try
		{
			const srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/apps/${srl}`);
			if (!res.success) throw res.message;
			return {
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
				message: (typeof e === 'string') ? e : message.error.service,
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