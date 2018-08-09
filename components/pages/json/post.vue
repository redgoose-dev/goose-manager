<template>
	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>Add JSON form</legend>
			<dl class="rg-form-field">
				<dt><label for="name">Name</label></dt>
				<dd>
					<form-text
						name="name"
						id="name"
						v-model="forms.name.value"
						placeholder="goose's navigation"
						:maxlength="100"
						:size="30"
						:error="!!forms.name.error"
						:required="true"
						:inline="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="description">Description</label></dt>
				<dd>
					<form-text
						name="description"
						id="description"
						v-model="forms.description.value"
						placeholder="note comment.."
						:maxlength="100"
						:error="!!forms.description.error"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="json">JSON</label></dt>
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
		</fieldset>
		<nav class="rg-nav">
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:inline="true"
				:label="!processing ? `${this.type === 'edit' ? 'Edit' : 'Add'} JSON` : null"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</template>

<script>
// components
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
// library
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
	components: {
		FormText,
		ButtonBasic,
	},
	props: {
		type: { type: String, default: 'add' }, // add,edit
		srl: { type: [Number,String] },
		data: {
			name: { type: String },
			description: { type: String },
			json: { type: String },
		},
	},
	data()
	{
		return {
			forms: {
				name: {
					value: this.data ? this.data.name : '',
					error: null,
				},
				description: {
					value: this.data ? this.data.description : '',
					error: null,
				},
				json: {
					value: this.data ? this.data.json : '',
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

			// reset error
			this.forms.name.error = null;
			this.forms.json.error = null;

			try
			{
				// check json data
				try
				{
					JSON.parse(this.forms.json.value);
				}
				catch(e)
				{
					this.forms.json.error = messages.msg.failedParsingJson;
					return;
				}

				this.processing = true;
				const data = formData({
					name: this.forms.name.value,
					json: this.forms.json.value,
					description: this.forms.description.value,
				});
				let url = this.type === 'edit' ? `/json/${this.srl}/edit` : '/json';
				let res = await this.$axios.$post(url, data);
				if (!res.success) throw res.message;
				this.processing = false;
				// redirect
				switch(this.type)
				{
					case 'edit':
						this.$router.push(`/json/${this.srl}`);
						break;
					default:
						this.$router.push('/json');
						break;
				}
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				this.$toast.add({
					message: (e && typeof e === 'string') ? e : `Failed ${this.type} JSON.`,
					color: 'error',
				});
			}
		}
	}
}
</script>