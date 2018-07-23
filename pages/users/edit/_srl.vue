<template>
<article>
	<page-header module="users" title="Edit user"/>

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
							v-model="email.value"
							placeholder="name@goose.com"
							:maxlength="60"
							formSize="35"
							:error="email.error"
							:required="true"
							:inline="true"
							@change="onChange('email')"/>
						<p class="rg-form-help">이미 등록된 이메일은 등록할 수 없습니다.</p>
					</dd>
				</dl>
			</div>
		</fieldset>
	</form>
</article>
</template>

<script>
import PageHeader from '~/components/contents/page-header';
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
import * as message from '../../../libs/messages';

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

	async asyncData(cox)
	{
		try
		{
			let res = await cox.$axios.$get(`/users/${cox.params.srl}`);
			if (!res.success) throw res.message;

			console.log(Object.keys(cox.app.store.state))
			return {
				email: {
					value: res.data.email,
					error: false,
					message: '',
				},
				name: {
					value: res.data.name,
					error: false,
					message: '',
				},
				level: {
					value: res.data.level,
					error: false,
					message: '',
				},
				srl: cox.params.srl,
				error: '',
				processing: false,
				level_public: cox.app.store.state.level.public,
				level_admin: cox.app.store.state.level.admin,
			};
			// TODO: 여기서부터..
		}
		catch(e)
		{
			console.error(e);
			cox.error({
				statusCode: 500,
				message: (typeof e === 'string') ? e : message.error.service,
			});
		}
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();


		}
	}
}
</script>