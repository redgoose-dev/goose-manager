<template>
<form @submit="onSubmit" ref="form">
	<section class="rg-form-section">
		<h1>basic form</h1>
		<div class="rg-form-section__body">
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Nest skin</label></dt>
				<dd>
					<form-checks
						type="radio"
						name="nest_skin"
						id="nest_skin"
						v-model="basicForms.nestSkin.value"
						:inline="true"
						:disabled="false"
						:items="[
							{ label: 'Default', value: 'default' },
							{ label: 'Advanced', value: 'advanced' },
						]"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Nest skin</label></dt>
				<dd>
					sdmgidgopgds
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Nest skin</label></dt>
				<dd>
					sdmgidgopgds
				</dd>
			</dl>
		</div>
	</section>

	<nav class="rg-nav">
		<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
		<button-basic
			type="submit"
			color="key"
			:label="!processing ? `Add Nest` : null"
			:inline="true"
			:icon="processing ? 'cached' : ''"
			:rotateIcon="processing"
			:disabled="processing"/>
	</nav>
</form>
</template>

<script>
// components
import FormText from '~/components/form/text';
import ButtonBasic from '~/components/button/basic';
import FormChecks from '~/components/form/checks';
// library
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';

export default {
	components: {
		FormText,
		FormChecks,
		ButtonBasic,
	},
	props: {},
	data()
	{
		return {
			basicForms: {
				nestSkin: {
					value: 'default',
					error: null,
				},
				id: {
					value: '',
					error: null,
				},
				name: {
					value: '',
					error: null,
				},
			},
			extraForms: null,
			error: null,
			processing: false,
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();
			console.log('submit');
		}
	}
}
</script>