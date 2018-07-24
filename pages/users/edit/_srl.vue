<template>
<article>
	<page-header module="users" title="Edit user"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>add user form</legend>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="email">E-mail</label></dt>
					<dd>
						<form-text
							type="email"
							name="email"
							id="email"
							v-model="email.value"
							placeholder="name@goose.com"
							:maxlength="60"
							formSize="35"
							:error="email.error"
							:required="true"
							:inline="true"
							@change="onChange('email')"/>
						<p class="rg-form-help">이미 등록된 이메일은 등록할 수 없습니다.</p>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="name">Name</label></dt>
					<dd>
						<form-text
							type="text"
							name="name"
							id="name"
							v-model="name.value"
							placeholder="goose"
							:maxlength="30"
							formSize="24"
							:error="email.error"
							:required="true"
							:inline="true"/>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="level">Level</label></dt>
					<dd>
						<form-text
							type="tel"
							name="level"
							id="level"
							v-model="level.value"
							:maxlength="24"
							formSize="5"
							:error="level.error"
							:required="true"
							:inline="true"/>
						<p class="rg-form-help">
							Public level: {{level_public}}, Admin level: {{level_admin}}
						</p>
					</dd>
				</dl>
			</div>
			<p v-if="error" class="rg-form-error">{{error}}</p>
		</fieldset>
		<nav class="rg-nav">
			<button-basic label="Index" to="/users" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? 'Edit user' : null"
				:inline="true"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
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
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},

	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get(`/users/${cox.params.srl}`);
			if (!res.success) throw res.message;

			return {
				email: {
					value: res.data.email,
					error: false,
					message: '',
				},
				name: {
					value: res.data.name,
					error: false,
					message: '',
				},
				level: {
					value: res.data.level,
					error: false,
					message: '',
				},
				srl: cox.params.srl,
				error: '',
				processing: false,
				level_public: cox.app.store.state.level.public,
				level_admin: cox.app.store.state.level.admin,
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
				const data = forms.formData({
					email: this.email.value,
					name: this.name.value,
					level: this.level.value,
				});
				let res = await this.$axios.$post(`/users/${this.srl}/edit`, data);
				if (!res.success) throw res.message;
				this.processing = false;
				alert('Success edit');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed add user.`;
				this.processing = false;
			}
		}
	}
}
</script>