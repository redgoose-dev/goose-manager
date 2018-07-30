<template>
<article>
	<page-header module="apps" title="Add app"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>Add app form</legend>
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
						formSize="30"
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
						placeholder="message"
						:maxlength="100"
						:error="!!forms.description.error"
						:required="true"/>
					<p class="rg-form-help">Description of the app</p>
				</dd>
			</dl>
			<p v-if="error" class="rg-form-error">{{error}}</p>
		</fieldset>
		<nav class="rg-nav">
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? `Add App` : null"
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
				id: {
					value: '',
					error: null,
				},
				name: {
					value: '',
					error: null,
				},
				description: {
					value: '',
					error: null,
				}
			},
			error: '',
			processing: false,
		}
	},
	mounted()
	{
		const { $refs } = this;
		if ($refs.form) $refs.form.id.focus();
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// reset form
			this.forms.id.error = null;

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
				let res = await this.$axios.$post('/apps', data);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push('/apps');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed add App.`;
				this.processing = false;
			}
		}
	}
}
</script>