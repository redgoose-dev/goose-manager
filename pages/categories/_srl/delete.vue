<template>
<article>
	<page-header module="categories" title="Delete category"/>

	<form @submit="onSubmit" class="rg-form-delete">
		<input type="hidden" name="srl" :value="srl"/>
		<div class="rg-form-delete__message">
			<p>다음 `Category`를 삭제하시겠습니까?</p>
			<p>
				<strong>{{forms.name}}</strong>
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
				:label="!processing ? 'Delete Category' : null"
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
			nest_srl: parseInt(this.$route.query.nest) || null,
			processing: false,
		};
	},
	async asyncData(cox)
	{
		try
		{
			const srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/categories/${srl}`);
			if (!res.success) throw res.message;
			return {
				forms: {
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
				let res = await this.$axios.$post(`/categories/${this.srl}/delete`);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.replace(`/categories${this.nest_srl ? `/${this.nest_srl}` : ''}`);
			}
			catch(e)
			{
				this.processing = false;
				if (e === messages.error.service) e = null;
				alert((e && typeof e === 'string') ? e : `Failed delete Category.`)
			}
		}
	}
}
</script>