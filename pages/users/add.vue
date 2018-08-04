<template>
<article>
	<page-header module="users" title="Add user"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>add user form</legend>
			<dl class="rg-form-field">
				<dt><label for="email">E-mail</label></dt>
				<dd>
					<form-text
						type="email"
						name="email"
						id="email"
						v-model="forms.email.value"
						placeholder="name@goose.com"
						:maxlength="60"
						formSize="35"
						:error="forms.email.error"
						:required="true"
						:inline="true"/>
					<p class="rg-form-help">이미 등록된 이메일은 등록할 수 없습니다.</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="name">Name</label></dt>
				<dd>
					<form-text
						type="text"
						name="name"
						id="name"
						v-model="forms.name.value"
						placeholder="goose"
						:maxlength="30"
						formSize="24"
						:error="forms.name.error"
						:required="true"
						:inline="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="password">Password</label></dt>
				<dd>
					<form-text
						type="password"
						name="password"
						id="password"
						v-model="forms.password.value"
						:maxlength="24"
						formSize="20"
						:error="forms.password.error"
						:required="true"
						:inline="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="password2">Confirm password</label></dt>
				<dd>
					<form-text
						type="password"
						name="password2"
						id="password2"
						v-model="forms.password2.value"
						:maxlength="24"
						formSize="20"
						:error="forms.password2.error"
						:required="true"
						:inline="true"
						@change="onChange('password2')"/>
					<p v-if="forms.password2.message" class="rg-form-help rg-form-help-error">
						{{forms.password2.message}}
					</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="level">Level</label></dt>
				<dd>
					<form-text
						type="tel"
						name="level"
						id="level"
						v-model="forms.level.value"
						:maxlength="24"
						formSize="5"
						:error="forms.level.error"
						:required="true"
						:inline="true"/>
					<p class="rg-form-help">
						Public level: {{level_public}}, Admin level: {{level_admin}}
					</p>
				</dd>
			</dl>
			<p v-if="error" class="rg-form-error">{{error}}</p>
		</fieldset>
		<nav class="rg-nav">
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? 'Add User' : null"
				:inline="true"
				:icon="processing ? 'cached' : ''"
				:rotateIcon="processing"
				:disabled="processing"/>
		</nav>
	</form>
</article>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'FormText': () => import('~/components/form/text'),
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	data()
	{
		let level_public = this.$store.state.level.public;
		let level_admin = this.$store.state.level.admin;

		return {
			forms: {
				email: {
					value: this.data ? this.data.email : '',
					error: false,
					message: '',
				},
				name: {
					value: this.data ? this.data.name : '',
					error: false,
					message: '',
				},
				password: {
					value: '',
					error: false,
					message: '',
				},
				password2: {
					value: '',
					error: false,
					message: '',
				},
				level: {
					value: this.data ? this.data.level : level_admin,
					error: false,
					message: '',
				},
			},
			error: '',
			processing: false,
			level_public,
			level_admin,
		};
	},
	mounted()
	{
		this.$refs.form.email.focus();
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// check password
			if (this.forms.password.value !== this.forms.password2.value)
			{
				this.forms.password2.error = true;
				this.forms.password2.message = messages.error.confirmPassword;
				this.$refs.form.password2.focus();
				return;
			}

			try
			{
				this.processing = true;
				const data = formData({
					email: this.forms.email.value,
					name: this.forms.name.value,
					pw: this.forms.password.value,
					pw2: this.forms.password2.value,
					level: this.forms.level.value,
				});
				let res = await this.$axios.$post('/users', data);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push('/users');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				alert((e && typeof e === 'string') ? e : `Failed add user.`);
			}
		},
		onChange(field)
		{
			switch (field)
			{
				case 'password2':
					if (this.forms.password.value !== this.forms.password2.value)
					{
						this.forms.password2.error = true;
						this.forms.password2.message = messages.error.confirmPassword;
					}
					else
					{
						this.forms.password2.error = false;
						this.forms.password2.message = '';
					}
					break;
				default:
					break;
			}
		}
	}
}
</script>