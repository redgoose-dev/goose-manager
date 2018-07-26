<template>
	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>{{type}} form</legend>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="id">ID</label></dt>
					<dd>
						<form-text
							name="id"
							id="id"
							v-model="id.value"
							placeholder="app_name"
							@change="onChange"
							:maxlength="16"
							:error="id.error"
							:required="true"
							:inline="true"/>
						<p v-if="id.message" class="rg-form-help rg-form-help-error">{{id.message}}</p>
						<p class="rg-form-help">
							Please enter only alphanumeric characters `-` and `_`.
						</p>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="name">Name</label></dt>
					<dd>
						<form-text
							name="name"
							id="name"
							v-model="name.value"
							placeholder="App name"
							:maxlength="50"
							:error="name.error"
							:required="true"
							:inline="true"/>
						<p v-if="name.message" class="rg-form-help rg-form-help-error">{{name.message}}</p>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="id">Description</label></dt>
					<dd>
						<form-text
							name="description"
							id="description"
							v-model="description.value"
							placeholder="message"
							:maxlength="100"
							:error="description.error"
							:required="true"/>
						<p class="rg-form-help">Description of the app</p>
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
				:label="!processing ? `${buttonLabel} app` : null"
				:inline="true"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</template>

<script>
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
import * as forms from '../../../libs/forms';
import * as messages from '../../../libs/messages';

export default {
	props: {
		type: { type: String, default: 'add' },
		data: {
			id: { type: String },
			name: { type: String },
		},
		srl: { type: [Number,String] },
	},
	components: {
		FormText,
		ButtonBasic,
	},
	data()
	{
		return {
			id: {
				value: this.data ? this.data.id : '',
				error: false,
				message: '',
			},
			name: {
				value: this.data ? this.data.name : '',
				error: false,
				message: '',
			},
			description: {
				value: this.data ? this.data.description : '',
				error: false,
				message: '',
			},
			error: '',
			processing: false,
			buttonLabel: this.type === 'edit' ? 'Edit' : 'Add',
		};
	},
	mounted()
	{
		if (this.$refs.form && this.type === 'add')
		{
			this.$refs.form.id.focus();
		}
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// check id
			const check = forms.checkId(this.id.value);
			if (!check)
			{
				this.id.error = true;
				this.id.message = 'Please check `id`';
				return;
			}

			try
			{
				this.processing = true;
				const data = forms.formData({
					id: this.id.value,
					name: this.name.value,
					description: this.description.value,
				});
				let res = await this.$axios.$post(
					this.type === 'edit' ? `/apps/${this.srl}/edit` : '/apps',
					data
				);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push('/apps');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed ${this.type} app.`;
				this.processing = false;
			}
		},
		onChange()
		{
			this.id.error = false;
			this.id.message = '';
		}
	}
}
</script>