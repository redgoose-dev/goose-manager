<template>
	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>{{type}} app form</legend>
			<dl class="rg-form-field">
				<dt><label for="id">ID</label></dt>
				<dd>
					<form-text
						name="id"
						id="id"
						v-model="forms.id.value"
						placeholder="app_name"
						:maxlength="16"
						:error="!!forms.id.error"
						:required="true"
						:inline="true"/>
					<p v-if="!!forms.id.error" class="rg-form-help rg-form-help-error">
						{{forms.id.error}}
					</p>
					<p class="rg-form-help">
						Please enter only alphanumeric characters `-` and `_`.
					</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="name">Name</label></dt>
				<dd>
					<form-text
						name="name"
						id="name"
						v-model="forms.name.value"
						placeholder="App name"
						:maxlength="50"
						:error="!!forms.name.error"
						:required="true"
						:inline="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="id">Description</label></dt>
				<dd>
					<form-text
						name="description"
						id="description"
						v-model="forms.description.value"
						placeholder="message"
						:maxlength="100"
						:error="!!forms.description.error"
						:required="false"/>
					<p class="rg-form-help">Description of the app</p>
				</dd>
			</dl>
		</fieldset>
		<nav class="rg-nav">
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? `${this.type === 'edit' ? 'Edit' : 'Add'}` : null"
				:inline="true"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</template>

<script>
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
	components: {
		'FormText': () => import('~/components/form/text'),
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	props: {
		type: { type: String, default: 'add' }, // add,edit
		srl: { type: [Number,String] },
		data: {
			id: { type: String },
			name: { type: String },
			description: { type: String },
		},
	},
	data()
	{
		return {
			forms: {
				id: {
					value: this.data ? this.data.id : '',
					error: null,
				},
				name: {
					value: this.data ? this.data.name : '',
					error: null,
				},
				description: {
					value: this.data ? this.data.description : '',
					error: null,
				},
			},
			processing: false,
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// reset forms
			this.forms.id.error = null;

			// check id
			const checked = checkId(this.forms.id.value);
			if (!checked)
			{
				this.forms.id.error = 'Please check `id`';
				return;
			}

			try
			{
				this.processing = true;
				const data = formData({
					id: this.forms.id.value,
					name: this.forms.name.value,
					description: this.forms.description.value,
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
				this.processing = false;
				this.$toast.add({
					message: (e && typeof e === 'string') ? e : `Failed ${this.type} app.`,
					color: 'error'
				});
			}
		}
	}
}
</script>