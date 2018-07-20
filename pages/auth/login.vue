<template>
<main class="login">
	<div>
		<article class="login__body">
			<h1 class="login__title">Goose Manager</h1>
			<p class="login__app-name">{{appName}}</p>
			<form @submit="onSubmitLogin" class="login__form">
				<fieldset class="login__fieldset">
					<legend>login form</legend>
					<div class="login__field">
						<label for="email">E-Mail</label>
						<div>
							<input
								type="email"
								name="email"
								id="email"
								:value="form.email"
								maxlength="30"
								placeholder="redgoose@me.com"
								required/>
							<i></i>
						</div>
					</div>
					<div class="login__field">
						<label for="password">Password</label>
						<div>
							<input
								type="password"
								name="password"
								id="password"
								:value="form.password"
								maxlength="30"
								placeholder=""
								required/>
							<i></i>
						</div>
					</div>
				</fieldset>
				<nav class="login__nav">
					<button-basic
						type="submit"
						:label="!processing ? 'Login' : null"
						:icon="processing ? 'cached' : ''"
						:rotateIcon="processing"
						size="large"
						color="key"
						:disabled="processing"/>
				</nav>
				<p v-if="error" class="login__error">
					Failed login
				</p>
			</form>
		</article>
	</div>
</main>
</template>

<style lang="scss" src="./login.scss" scoped></style>
<script>
import * as forms from '../../libs/forms';
import ButtonBasic from '~/components/button/basic';

export default {
	components: {
		ButtonBasic,
	},
	layout: 'blank',
	middleware: 'login',
	data()
	{
		return {
			form: {
				email: '',
				password: '',
			},
			processing: false,
			error: false,
		};
	},
	computed: {
		appName()
		{
			return process.env.APP_NAME;
		}
	},
	methods: {
		async onSubmitLogin(e)
		{
			e.preventDefault();

			const { $axios, $store, $router } = this;
			const form = e.target;

			// off processing
			this.processing = true;

			// request api
			try
			{
				const data = forms.formData({
					email: form.email.value,
					pw: form.password.value,
					host: location.host,
				});
				const resultApi = await $axios.$post('/auth/login', data);
				if (!(resultApi.success && resultApi.data && resultApi.data.email)) throw resultApi.message;
				this.processing = false;

				// reset form
				this.form.email = '';
				this.form.password = '';

				// save session
				const resultSession = await $axios.$post(`${$store.state.url_app}/api/session-save`, resultApi.data);
				if (!(resultSession && resultSession.success)) throw resultSession.message || 'Failed login';

				// redirect home
				location.href = '/';
			}
			catch(e)
			{
				// error api
				this.processing = false;
				this.error = true;
			}
		}
	}
};
</script>