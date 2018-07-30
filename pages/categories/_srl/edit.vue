<template>
<article>
	<page-header module="categories" title="Edit category"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>Edit category form</legend>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="name">Name</label></dt>
					<dd>
						<form-text
							type="text"
							name="name"
							id="name"
							v-model="forms.name.value"
							placeholder="landscape"
							:maxlength="40"
							formSize="30"
							:error="!!forms.name.error"
							:required="true"
							:inline="true"/>
					</dd>
				</dl>
			</div>
			<p v-if="error" class="rg-form-error">{{error}}</p>
		</fieldset>

		<nav class="rg-nav">
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? 'Edit category' : null"
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
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
// library
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
	components: {
		PageHeader,
		FormText,
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
			error: null,
			processing: false,
		};
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/categories/${srl}`);
			return {
				forms: {
					name: {
						value: res.data.name,
						error: null,
					}
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
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			try
			{
				this.processing = true;
				const data = formData({
					nest_srl: this.nest_srl,
					name: this.forms.name.value
				});
				let res = await this.$axios.$post(`/categories/${this.srl}/edit`, data);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push(`/categories${this.nest_srl ? `/${this.nest_srl}` : ''}`);
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed add category.`;
				this.processing = false;
			}
		}
	}
}
</script>