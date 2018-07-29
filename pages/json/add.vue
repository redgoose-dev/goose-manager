<template>
<article>
	<page-header module="json" title="Add JSON"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>Add JSON form</legend>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="name">Name</label></dt>
					<dd>
						<form-text
							name="name"
							id="name"
							v-model="forms.name.value"
							:maxlength="100"
							:error="!!forms.name.error"
							:required="true"/>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="name">Description</label></dt>
					<dd>
						<form-text
							name="description"
							id="description"
							v-model="forms.description.value"
							:maxlength="100"
							:error="!!forms.description.error"/>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="name">JSON</label></dt>
					<dd>
						<form-text
							type="textarea"
							name="json"
							id="json"
							v-model="forms.json.value"
							:placeholder='`{ "foo": "bar" }`'
							:rows="15"
							:error="!!forms.json.error"
							:required="true"/>
						<p v-if="!!forms.json.error" class="rg-form-help rg-form-help-error">
							{{forms.json.error}}
						</p>
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
				:label="!processing ? `Add JSON` : null"
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
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
	components: {
		PageHeader,
		FormText,
		ButtonBasic,
	},
	data()
	{
		return {
			forms: {
				name: {
					value: '',
					error: null,
				},
				json: {
					value: '',
					error: null,
				},
				description: {
					value: '',
					error: null,
				},
			},
			error: '',
			processing: false,
		};
	},
	mounted()
	{
		const { $refs } = this;
		if ($refs.form) $refs.form.name.focus();
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// reset error
			this.forms.name.error = null;
			this.forms.json.error = null;
			this.error = null;

			try
			{
				// test json data
				try
				{
					JSON.parse(this.forms.json.value);
				}
				catch(e)
				{
					this.forms.json.error = 'Failed parsing json data.';
					return;
				}

				this.processing = true;
				const data = formData({
					name: this.forms.name.value,
					json: this.forms.json.value,
					description: this.forms.description.value,
				});
				let res = await this.$axios.$post('/json', data);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push('/json');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed add JSON.`;
				this.processing = false;
			}
		}
	}
}
</script>