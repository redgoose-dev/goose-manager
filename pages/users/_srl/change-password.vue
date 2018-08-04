<template>
<article>
	<page-header module="users" title="Change user password"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>change password form</legend>
			<dl class="rg-form-field">
				<dt><label for="password">Current password</label></dt>
				<dd>
					<form-text
						type="password"
						name="password"
						id="password"
						v-model="forms.password.value"
						:maxlength="24"
						formSize="20"
						:error="!!forms.password.error"
						:required="true"
						:inline="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="password_new">New password</label></dt>
				<dd>
					<form-text
						type="password"
						name="password_new"
						id="password_new"
						v-model="forms.password_new.value"
						:maxlength="24"
						formSize="20"
						:error="!!forms.password_new.error"
						:required="true"
						:inline="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="password_new2">Confirm password</label></dt>
				<dd>
					<form-text
						type="password"
						name="password_new2"
						id="password_new2"
						v-model="forms.password_new2.value"
						:maxlength="24"
						formSize="20"
						:error="!!forms.password_new2.error"
						:required="true"
						:inline="true"/>
					<p v-if="!!forms.password_new2.error" class="rg-form-help rg-form-help-error">
						{{forms.password_new2.error}}
					</p>
					<p class="rg-form-help">
						Please input a password such as "new password".
					</p>
				</dd>
			</dl>
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
import { formData } from '../../../libs/forms';
import * as messages from '../../../libs/messages';

export default {
	components: {
		'PageHeader': () => import('~/components/contents/page-header'),
		'FormText': () => import('~/components/form/text'),
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	validate(cox)
	{
		return cox.params.srl && /^\d+$/.test(cox.params.srl);
	},
	data()
	{
		return {
			forms: {
				password: {
					value: '',
					error: null,
				},
				password_new: {
					value: '',
					error: null,
				},
				password_new2: {
					value: '',
					error: null,
				},
			},
			processing: false,
			self: parseInt(this.$store.state.authUser.srl) === parseInt(this.$route.params.srl),
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// reset error
			this.forms.password_new2.error = null;

			// check password
			if (this.forms.password_new.value !== this.forms.password_new2.value)
			{
				this.forms.password_new2.error = messages.error.confirmPassword;
				this.$refs.form.password_new2.focus();
				return;
			}

			try
			{
				this.processing = true;
				const data = formData({
					pw: this.forms.password.value,
					new_pw: this.forms.password_new.value,
					confirm_pw: this.forms.password_new2.value,
				});
				let res = await this.$axios.$post(`/users/${this.$route.params.srl}/change-password`, data);
				if (!res.success) throw res.message;
				this.processing = false;

				// reset form
				this.forms.password.value = '';
				this.forms.password_new.value = '';
				this.forms.password_new2.value = '';

				// 자신의 계정이면 로그아웃 할건지 물어보기
				if (this.self)
				{
					if (confirm(messages.msg.questionChangePassword))
					{
						this.$router.replace('/auth/logout');
						return;
					}
				}
				else
				{
					alert(messages.msg.successChangePassword);
				}
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				alert((e && typeof e === 'string') ? e : messages.msg.failedChangePassword)
			}
		}
	}
}
</script>