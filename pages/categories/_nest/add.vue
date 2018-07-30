<template>
<article>
	<page-header module="categories" title="Add category"/>

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
import { formData } from '../../../libs/forms';
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
			forms: {
				name: {
					value: '',
					error: null,
				},
			},
			error: null,
			processing: false,
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			this.error = null;
			this.forms.name.error = null;

			try
			{
				this.processing = true;
				const data = formData({
					nest_srl: this.nest_srl,
					name: this.forms.name.value
				});
				let res = await this.$axios.$post('/categories', data);
				if (!res.success) throw res.message;
				this.processing = false;
				// TODO: 아무것도 없는 상태에서 추가하면 화면이 변하지 않는 현상이 나타나서 리프레시로 변경
				location.href = `/categories/${this.nest_srl}`;
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