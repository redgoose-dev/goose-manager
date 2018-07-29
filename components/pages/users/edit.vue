<template>

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