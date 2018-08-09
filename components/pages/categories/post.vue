<template>
<form @submit="onSubmit" ref="form">
	<fieldset class="rg-form-fieldset">
		<legend>{{type}} category form</legend>
		<dl class="rg-form-field">
			<dt><label for="name">Name</label></dt>
			<dd>
				<form-text
					type="text"
					name="name"
					id="name"
					v-model="forms.name.value"
					placeholder="landscape"
					:maxlength="40"
					:size="30"
					:error="!!forms.name.error"
					:required="true"
					:inline="true"/>
			</dd>
		</dl>
	</fieldset>
	<nav class="rg-nav">
		<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
		<button-basic
			type="submit"
			color="key"
			:label="!processing ? `${this.type === 'edit' ? 'Edit' : 'Add'} Category` : null"
			:inline="true"
			:icon="processing ? 'cached' : ''"
			:rotateIcon="processing"
			:disabled="processing"/>
	</nav>
</form>
</template>

<script>
import { formData } from '../../../libs/forms';
import * as messages from '../../../libs/messages';

export default {
	components: {
		'FormText': () => import('~/components/form/text'),
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	props: {
		type: { type: String, default: 'add' }, // add,edit
		srl: { type: [Number,String] },
		nest_srl: { type: [Number,String], required: true },
		data: {
			name: { type: String },
		},
	},
	data()
	{
		return {
			processing: false,
			forms: {
				name: {
					value: this.data ? this.data.name : '',
					error: null,
				}
			}
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			try
			{
				this.processing = true;
				const data = formData({
					nest_srl: this.nest_srl || null,
					name: this.forms.name.value
				});
				let url = (this.type === 'edit' && this.srl) ? `/categories/${this.srl}/edit` : '/categories';
				let res = await this.$axios.$post(url, data);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push(`/categories/${this.nest_srl}`);
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				this.$toast.add({
					message: (e && typeof e === 'string') ? e : `Failed ${this.type} category.`,
					color: 'error',
				});
			}
		}
	}
}
</script>