<template>
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
						v-model="form.email.value"
						placeholder="name@goose.com"
						:maxlength="60"
						formSize="35"
						:error="form.email.error"
						:required="true"
						:inline="true"
						:readonly="true"/>
					<p class="rg-form-help">이메일 주소는 수정할 수 없습니다.</p>
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
						v-model="form.name.value"
						placeholder="goose"
						:maxlength="30"
						formSize="24"
						:error="form.name.error"
						:required="true"
						:inline="true"/>
				</dd>
			</dl>
		</div>
		<div v-if="isAdmin" class="rg-form-field rg-form-field-line">
			<dl class="rg-form-field__group">
				<dt><label for="level">Level</label></dt>
				<dd>
					<form-text
						type="tel"
						name="level"
						id="level"
						v-model="form.level.value"
						:maxlength="24"
						formSize="5"
						:error="form.level.error"
						:required="true"
						:inline="true"/>
					<p class="rg-form-help">
						Public level: {{level_public}}, Admin level: {{level_admin}}
					</p>
				</dd>
			</dl>
		</div>
	</fieldset>
	<nav class="rg-nav">
		<button-basic
			v-if="type==='user'"
			label="Index"
			to="/users"
			:inline="true"/>
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
</template>

<script>
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
import * as forms from '../../../libs/forms';
import * as messages from '../../../libs/messages';

export default {
	components: {
		FormText,
		ButtonBasic,
	},
	props: {
		type: { type: String },
		data: {},
		srl: { type: Number },
	},
	data()
	{
		let isAdmin = this.$store.state.authUser.level >= this.$store.state.level.admin;
		return {
			form: {
				email: {
					value: this.data.email,
					error: false,
					message: '',
				},
				name: {
					value: this.data.name,
					error: false,
					message: '',
				},
				level: isAdmin && {
					value: parseInt(this.data.level),
					error: false,
					message: '',
				},
			},
			processing: false,
			level_public: this.$store.state.level.public,
			level_admin: this.$store.state.level.admin,
			isAdmin,
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			try
			{
				this.processing = true;
				const data = forms.formData({
					email: this.form.email && this.form.email.value,
					name: this.form.name && this.form.name.value,
					level: this.form.level && this.form.level.value,
				});
				let res = await this.$axios.$post(`/users/${this.srl}/edit`, data);
				if (!res.success) throw res.message;
				this.processing = false;
				alert('Success edit user');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				let error = (e && typeof e === 'string') ? e : `Failed edit user.`;
				alert(error);
			}
		}
	}
}
</script>