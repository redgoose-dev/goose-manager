<template>
<article>
	<page-header module="users" title="Add user"/>

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
							:inline="true"/>
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
					<dt><label for="password">Password</label></dt>
					<dd>
						<form-text
							type="password"
							name="password"
							id="password"
							v-model="password.value"
							:maxlength="24"
							formSize="20"
							:error="password.error"
							:required="true"
							:inline="true"/>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="password2">Confirm password</label></dt>
					<dd>
						<form-text
							type="password"
							name="password2"
							id="password2"
							v-model="password2.value"
							:maxlength="24"
							formSize="20"
							:error="password2.error"
							:required="true"
							:inline="true"
							@change="onChange('password2')"/>
						<p v-if="password2.message" class="rg-form-help rg-form-help-error">
							{{password2.message}}
						</p>
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
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? 'Add user' : null"
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
import * as forms from '../../libs/forms';
import * as messages from '../../libs/messages';

export default {
	components: {
		PageHeader,
		FormText,
		ButtonBasic,
	},
	data()
	{
		return {
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
				value: this.data ? this.data.level : this.$store.state.level.admin,
				error: false,
				message: '',
			},
			error: '',
			processing: false,
			level_public: this.$store.state.level.public,
			level_admin: this.$store.state.level.admin,
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
			if (this.password.value !== this.password2.value)
			{
				this.password2.error = true;
				this.password2.message = messages.error.confirmPassword;
				this.$refs.form.password2.focus();
				return;
			}

			// post
			try
			{
				this.processing = true;
				const data = forms.formData({
					email: this.email.value,
					name: this.name.value,
					pw: this.password.value,
					pw2: this.password2.value,
					level: this.level.value,
				});
				let res = await this.$axios.$post('/users', data);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push('/users');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.error = (e && typeof e === 'string') ? e : `Failed add user.`;
				this.processing = false;
			}
		},
		onChange(field)
		{
			switch (field)
			{
				case 'password2':
					if (this.password.value !== this.password2.value)
					{
						this.password2.error = true;
						this.password2.message = messages.error.confirmPassword;
					}
					else
					{
						this.password2.error = false;
						this.password2.message = '';
					}
					break;
				default:
					break;
			}
		}
	}
}
</script>