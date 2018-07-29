<template>
<article>
	<page-header module="apps" title="Edit app"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>Edit app form</legend>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="id">ID</label></dt>
					<dd>
						<form-text
							name="id"
							id="id"
							v-model="forms.id.value"
							placeholder="app_name"
							@change="onChange"
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
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="name">Name</label></dt>
					<dd>
						<form-text
							name="name"
							id="name"
							v-model="forms.name.value"
							placeholder="App name"
							:maxlength="50"
							formSize="30"
							:error="!!forms.name.error"
							:required="true"
							:inline="true"/>
						<p v-if="!!forms.name.error" class="rg-form-help rg-form-help-error">
							{{forms.name.error}}
						</p>
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
							v-model="forms.description.value"
							placeholder="message"
							:maxlength="100"
							:error="!!forms.description.error"
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
				:label="!processing ? `Edit App` : null"
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
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	data()
	{
		return {
			srl: parseInt(this.$route.params.srl),
			error: '',
			processing: false,
		};
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/apps/${srl}`);
			if (!res.success) throw res.message;
			return {
				forms: {
					id: {
						value: res.data.id,
						error: '',
					},
					name: {
						value: res.data.name,
						error: '',
					},
					description: {
						value: res.data.description,
						error: '',
					}
				}
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
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// check id
			const check = checkId(this.forms.id.value);
			if (!check)
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
				let res = await this.$axios.$post(`/apps/${this.srl}/edit`, data);
				if (!res.success) throw res.message;
				this.processing = false;
				alert('Success edit app');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed add app.`;
				this.processing = false;
			}
		},
		onChange()
		{
			this.forms.id.error = '';
		}
	}
}
</script>