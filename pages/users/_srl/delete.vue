<template>
<article>
	<page-header module="users" title="Delete user"/>

	<form @submit="onSubmit" class="rg-form-delete">
		<input type="hidden" name="srl" :value="srl"/>
		<p class="rg-form-delete__message">
			<strong>{{data.email}}({{data.name}})</strong> User를 삭제하시겠습니까?
		</p>
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
	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get(`/users/${cox.params.srl}`);
			if (!res.success) throw res.message;
			return {
				data: res.data,
				srl: cox.params.srl,
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
		const { $refs } = this;
		if ($refs.button_submit) $refs.button_submit.$el.focus();
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			try
			{
				this.processing = true;
				let res = await this.$axios.$post(`/users/${this.srl}/delete`);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.replace('/users');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				alert((e && typeof e === 'string') ? e : `Failed delete user.`);
			}
		}
	}
}
</script>