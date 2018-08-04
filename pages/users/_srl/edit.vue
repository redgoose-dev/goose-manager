<template>
<article>
	<page-header module="users" title="Edit user"/>

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
						:maxlength="60"
						formSize="35"
						:required="true"
						:inline="true"
						:disabled="true"/>
					<p class="rg-form-help rg-form-help-error">이메일 주소는 수정할 수 없습니다.</p>
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
		</fieldset>
		<nav class="rg-nav">
			<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
			<button-basic
				type="submit"
				color="key"
				:label="!processing ? 'Edit User' : null"
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
			srl: parseInt(this.$route.params.srl),
			processing: false,
			level_public: this.$store.state.level.public,
			level_admin: this.$store.state.level.admin,
			isAdmin: this.$store.state.authUser.level >= this.$store.state.level.admin,
		}
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/users/${srl}`);
			if (!res.success) throw res.message;

			return {
				forms: {
					email: { value: res.data.email },
					name: {
						value: res.data.name,
						error: null,
					},
					level: {
						value: parseInt(res.data.level),
						error: null,
					}
				}
			};
e		}
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
				const data = formData({
					email: this.forms.email && this.forms.email.value,
					name: this.forms.name && this.forms.name.value,
					level: (this.isAdmin && this.forms.level) ? this.forms.level.value : null,
				});
				let res = await this.$axios.$post(`/users/${this.srl}/edit`, data);
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
		}
	}
}
</script>