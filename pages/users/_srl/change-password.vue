<template>
<article>
	<page-header module="users" title="Change user password"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>change password form</legend>
			<div class="rg-form-field rg-form-field-line first">
				<dl class="rg-form-field__group">
					<dt><label for="password">Current password</label></dt>
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
					<dt><label for="password_new">New password</label></dt>
					<dd>
						<form-text
							type="password"
							name="password_new"
							id="password_new"
							v-model="password_new.value"
							:maxlength="24"
							formSize="20"
							:error="password_new.error"
							:required="true"
							:inline="true"
							@change="checkPasswordConfirm"/>
					</dd>
				</dl>
			</div>
			<div class="rg-form-field rg-form-field-line">
				<dl class="rg-form-field__group">
					<dt><label for="password_new">Confirm password</label></dt>
					<dd>
						<form-text
							type="password"
							name="password_new2"
							id="password_new2"
							v-model="password_new2.value"
							:maxlength="24"
							formSize="20"
							:error="password_new2.error"
							:required="true"
							:inline="true"
							@change="checkPasswordConfirm"/>
						<p v-if="password_new2.message" class="rg-form-help rg-form-help-error">
							{{password_new2.message}}
						</p>
						<p class="rg-form-help">
							Please input a password such as "new password".
						</p>
					</dd>
				</dl>
			</div>
		</fieldset>
		<nav class="rg-nav">
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? 'Change password' : null"
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
	data()
	{
		return {
			password: {
				value: '',
				error: false,
				message: '',
			},
			password_new: {
				value: '',
				error: false,
				message: '',
			},
			password_new2: {
				value: '',
				error: false,
				message: '',
			},
			processing: false,
			self: parseInt(this.$store.state.authUser.srl) === parseInt(this.$route.params.srl),
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// check password
			if (this.password_new.value !== this.password_new2.value)
			{
				this.password_new2.error = true;
				this.password_new2.message = messages.error.confirmPassword;
				this.$refs.form.password_new2.focus();
				return;
			}

			try
			{
				this.processing = true;
				const data = forms.formData({
					pw: this.password.value,
					new_pw: this.password_new.value,
					confirm_pw: this.password_new2.value,
				});
				let res = await this.$axios.$post(`/users/${this.$route.params.srl}/change-password`, data);
				if (!res.success) throw res.message;
				this.processing = false;

				if (this.self)
				{
					if (confirm('비밀번호가 변경되었으므로 로그아웃이 필요합니다. 로그아웃 하시겠습니까?'))
					{
						this.$router.replace('/auth/logout');
						return;
					}
				}
				else
				{
					alert('Success change user password.');
				}

				this.password.value = '';
				this.password_new.value = '';
				this.password_new2.value = '';
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				alert((e && typeof e === 'string') ? e : `Failed change user password.`);
			}
		},
		checkPasswordConfirm()
		{
			if (this.password_new.value !== this.password_new2.value)
			{
				this.password_new2.error = true;
				this.password_new2.message = messages.error.confirmPassword;
			}
			else
			{
				this.password_new2.error = false;
				this.password_new2.message = '';
			}
		}
	}
}
</script>