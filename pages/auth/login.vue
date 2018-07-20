<template>
<main>
	<article>
		<h1>Login</h1>
		<form @submit="onSubmitLogin">
			<fieldset>
				<legend>login form</legend>
				<div>
					<p><label for="email">email</label></p>
					<input type="email" name="email" id="email" :value="form.email" required/>
				</div>
				<div>
					<p><label for="password">password</label></p>
					<input type="password" name="password" id="password" :value="form.password" required/>
				</div>
			</fieldset>
			<p v-if="error">
				Failed login
			</p>
			<nav>
				<button
					type="submit"
					:disabled="processing">
					{{!processing ? 'Login' : 'Processing..'}}
				</button>
			</nav>
		</form>
	</article>
</main>
</template>

<script>
import * as forms from '../../libs/forms';

export default {
	layout: 'blank',
	middleware: 'login',
	data()
	{
		return {
			form: {
				email: 'root@goose',
				password: '1234',
			},
			processing: false,
			error: false,
		};
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
				console.error(e);
				this.processing = false;
				this.error = true;
			}
		}
	},
};
</script>