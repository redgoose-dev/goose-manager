<template>
<article>
	<page-header module="json" title="Edit JSON"/>

	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>Edit JSON form</legend>

		</fieldset>
	</form>
</article>
</template>

<script>
// components
import PageHeader from '~/components/contents/page-header';
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
// library
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

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
	data()
	{
		return {
			srl: parseInt(this.$route.params.srl),
			error: '',
			processing: false,
		};
	},
	async asyncData(cox)
	{
		try
		{
			let srl = parseInt(cox.params.srl);
			let res = await cox.$axios.$get(`/json/${srl}`);
			if (!res.success) throw res.message;
			console.log(res.data);
			return {
				forms: {
					name: {
						value: res.data.name,
						error: null,
					},
					json: {
						value: res.data.json,
						error: null,
					},
					description: {
						value: res.data.description,
						error: null,
					},
				},
			};
		}
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

			//
		}
	}
}
</script>