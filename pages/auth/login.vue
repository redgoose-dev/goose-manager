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

			const { $axios } = this;
			const form = e.target;

			// off processing
			this.processing = true;

			// request api
			let user = null;
			try
			{
				const data = forms.formData({ email: form.email.value, pw: form.password.value });
				const result = await $axios.$post('/auth/login', data);
				if (!(result.success && result.data && result.data.email)) throw result.message;
				this.processing = false;
				user = result.data
				// TODO: test를 위하여..
				// this.form.email = '';
				// this.form.password = '';
			}
			catch(e)
			{
				// error api
				console.error(e);
				this.processing = false;
				this.error = true;
				return;
			}

			console.log(user);

			// TODO: 내부 api를 통하여 세션에 토큰과 사용자 정보를 저장하기

			// TODO: 여기서부터..
			// TODO: 토큰을 쿠키에 담고 headers 에서 토큰 교체하기
			//$axios.setHeader('Authorization', process.env.TOKEN_PUBLIC);
		}
	},
};
</script>