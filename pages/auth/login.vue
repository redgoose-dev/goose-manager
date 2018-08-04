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
								v-model="forms.email"
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
								v-model="forms.password"
								maxlength="30"
								placeholder=""
								required/>
							<i></i>
						</div>
					</div>
				</fieldset>

				<p v-if="!!error" class="login__error">{{error}}</p>

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
			</form>
		</article>
	</div>
</main>
</template>

<style lang="scss" src="./login.scss" scoped></style>
<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
	components: {
		'ButtonBasic': () => import('~/components/button/basic'),
	},
	layout: 'blank',
	middleware: 'login',
	data()
	{
		return {
			forms: {
				email: '',
				password: '',
			},
			processing: false,
			error: '',
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

			const { $axios, $store } = this;

			// off processing
			this.processing = true;

			// request api
			try
			{
				const data = formData({
					email: this.forms.email,
					pw: this.forms.password,
					host: location.host,
				});
				const resultApi = await $axios.$post('/auth/login', data);
				if (!(resultApi.success && resultApi.data && resultApi.data.email)) throw resultApi.message;

				// save session
				const resultSession = await $axios.$post(`${$store.state.url_app}/api/session-save`, resultApi.data);
				if (!(resultSession && resultSession.success))
				{
					throw resultSession.message || messages.error.failedLogin;
				}

				// reset form
				this.processing = false;
				this.forms.email = '';
				this.forms.password = '';

				// redirect home
				location.href = '/';
			}
			catch(e)
			{
				this.processing = false;
				this.error = messages.error.failedLogin;
			}
		}
	}
};
</script>