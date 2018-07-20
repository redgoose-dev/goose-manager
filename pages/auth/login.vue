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

			const { $axios, $store } = this;
			const form = e.target;

			// off processing
			this.processing = true;

			// request api
			let user = null;
			try
			{
				const data = forms.formData({ email: form.email.value, pw: form.password.value });
				const resultApi = await $axios.$post('/auth/login', data);
				if (!(resultApi.success && resultApi.data && resultApi.data.email)) throw resultApi.message;
				this.processing = false;
				user = resultApi.data;
				// TODO: test를 위하여..
				// this.form.email = '';
				// this.form.password = '';

				// save session
				const resultSession = await $axios.$post(`${$store.state.url_app}/api/session-save`, {});
				console.log(resultSession);
			}
			catch(e)
			{
				// error api
				console.error(e);
				this.processing = false;
				this.error = true;
				return;
			}

			// TODO: 내부 api를 통하여 세션에 토큰과 사용자 정보를 저장하기
			// TODO: 참고 url (https://nuxtjs.org/examples/auth-routes)

			// TODO: 여기서부터..
			// TODO: 토큰을 쿠키에 담고 headers 에서 토큰 교체하기
			//$axios.setHeader('Authorization', process.env.TOKEN_PUBLIC);
		}
	},
};
</script>