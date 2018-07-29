<template>
<article>
	<page-header module="categories"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>add category form</legend>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="name">Name</label></dt>
					<dd>
						<form-text
							type="text"
							name="name"
							id="name"
							v-model="name.value"
							placeholder="landscape"
							:maxlength="40"
							formSize="30"
							:error="name.error"
							:required="true"
							:inline="true"/>
						<p class="rg-form-help">이미 등록된 이메일은 등록할 수 없습니다.</p>
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
				:label="!processing ? 'Add category' : null"
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
import * as forms from '../../../libs/forms';
import * as messages from '../../../libs/messages';

export default {
	components: {
		PageHeader,
		FormText,
		ButtonBasic,
	},
	validate(cox)
	{
		return cox.params.nest && /^\d+$/.test(cox.params.nest);
	},
	data()
	{
		return {
			nest_srl: parseInt(this.$route.params.nest) || null,
			name: {
				value: '',
				error: false,
				message: '',
			},
			error: '',
			processing: false,
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			try
			{
				this.processing = true;
				const data = forms.formData({
					nest_srl: this.nest_srl,
					name: this.name.value
				});
				let res = await this.$axios.$post('/categories', data);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push(`/categories/${this.nest_srl}`);
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