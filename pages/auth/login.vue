<template>
<article>
	<h1>Login</h1>
	<form @submit="onSubmitLogin">
		<fieldset>
			<legend>login form</legend>
			<div>
				<p><label for="email">email</label></p>
				<input type="email" name="email" id="email" required/>
			</div>
			<div>
				<p><label for="password">password</label></p>
				<input type="password" name="password" id="password" required/>
			</div>
		</fieldset>
		<nav>
			<button
				type="submit"
				:disabled="processing">
				{{!processing ? 'Login' : 'Processing..'}}
			</button>
		</nav>
	</form>
</article>
</template>

<script>
import * as forms from '../../libs/forms';

export default {
	data()
	{
		return {
			processing: false,
		};
	},
	methods: {
		onSubmitLogin: async function(e)
		{
			e.preventDefault();

			const { $axios } = this;
			const form = e.target;

			// off processing
			this.processing = true;

			// request api
			let result = null;
			try
			{
				const data = forms.formData({ email: form.email.value, pw: form.password.value });
				result = await $axios.$post('/auth/login', data);
				if (!(result.success && result.data && result.data.email)) throw 'error';
				this.processing = false;
			}
			catch(e)
			{
				// TODO: change screen
				// error api
				console.error(e);
				this.processing = false;
				return;
			}

			// TODO: 여기서부터..
			// TODO: 토큰을 쿠키에 담고 headers 에서 토큰 교체하기
			console.log(result.data);
			//$axios.setHeader('Authorization', process.env.TOKEN_PUBLIC);
		}
	},
};
</script>