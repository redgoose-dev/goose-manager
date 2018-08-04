<template>
<form @submit="onSubmit" ref="form">
	<section class="rg-form-section">
		<h1>Basic forms</h1>
		<div class="rg-form-section__body">
			<dl class="rg-form-field">
				<dt><label for="nest_apps">App</label></dt>
				<dd>
					<form-select
						id="nest_apps"
						name="nest_apps"
						v-model="forms.app_srl.value"
						:options="apps"
						:required="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_id">ID</label></dt>
				<dd>
					<form-text
						id="nest_id"
						name="nest_id"
						v-model="forms.id.value"
						:error="!!forms.id.error"
						placeholder="nest-id"
						:maxlength="20"
						:inline="true"
						:required="true"/>
					<p v-if="!!forms.id.error" class="rg-form-help rg-form-help-error">{{forms.id.error}}</p>
					<p class="rg-form-help">영문과 숫자 `-`, `_`만 입력 가능합니다.</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_name">Name</label></dt>
				<dd>
					<form-text
						id="nest_name"
						name="nest_name"
						v-model="forms.name.value"
						:maxlength="40"
						:size="30"
						placeholder="Nest name"
						:inline="true"
						:required="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_description">Description</label></dt>
				<dd>
					<form-text
						id="nest_description"
						name="nest_description"
						v-model="forms.description.value"
						:maxlength="100"
						placeholder="Description word"/>
					<p class="rg-form-help">
						이 Nest에 대한 설명을 입력합니다.
					</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="nest_skin">Skin</label></dt>
				<dd>
					<form-checks
						type="radio"
						name="nest_skin"
						id="nest_skin"
						v-model="skin"
						:inline="true"
						:disabled="false"
						:items="[
							{ label: 'Default', value: 'default' },
							{ label: 'Advanced', value: 'advanced' },
						]"/>
					<p class="rg-form-help">
						skin을 변경하면 `extra form`의 항목이 변하는것을 주의하세요.
					</p>
				</dd>
			</dl>
		</div>
	</section>

	<section class="rg-form-section">
		<h1>Extra forms</h1>
		<div v-if="skin === 'default'" class="rg-form-section__body">
			작업예정..
		</div>
	</section>

	<nav class="rg-nav">
		<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
		<button-basic
			type="submit"
			color="key"
			:label="!processing ? `${typeLabel} Nest` : null"
			:inline="true"
			:icon="processing ? 'cached' : ''"
			:rotateIcon="processing"
			:disabled="processing"/>
	</nav>
</form>
</template>

<script>
// library
import { checkId, formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as articlePreference from '~/libs/articles/preference';

export default {
	components: {
		'FormText': () => import('~/components/form/text'),
		'FormChecks': () => import('~/components/form/checks'),
		'FormSelect': () => import('~/components/form/select'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'ExtraDefault': () => import('~/components/pages/nests/extra/default'),
		'ExtraAdvanced': () => import('~/components/pages/nests/extra/advanced'),
	},
	props: {
		type: { type: String, default: 'add' },
		srl: { type: Number },
		datas: { type: Object },
	},
	data()
	{
		return {
			skin: (this.datas.nest && this.datas.nest.json.skin) ? this.datas.nest.json.skin : 'default',
			forms: {
				app_srl: {
					value: this.datas.nest ? this.datas.nest.app_srl : '',
					error: null,
				},
				id: {
					value: this.datas.nest ? this.datas.nest.id : '',
					error: null,
				},
				name: {
					value: this.datas.nest ? this.datas.nest.name : '',
					error: null,
				},
				description: {
					value: this.datas.nest ? this.datas.nest.description : '',
					error: null,
				},
			},
			apps: this.datas.apps.map((o, k) => {
				return {
					label: `[${o.id}] ${o.name}`,
					value: o.srl,
				};
			}),
			nest: this.datas.nest || {},
			json: {},
			processing: false,
		};
	},
	computed: {
		typeLabel() { return (this.type === 'edit') ? 'Edit' : 'Add' },
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// reset forms
			this.forms.id.error = null;

			// check id
			const checked = checkId(this.forms.id.value);
			if (!checked)
			{
				this.forms.id.error = 'Please check `id`';
				return;
			}

			// set json field
			let json = Object.assign({}, this.json);
			json.skin = this.skin;

			try
			{
				this.processing = true;
				const data = formData({
					app_srl: this.forms.app_srl.value,
					id: this.forms.id.value,
					name: this.forms.name.value,
					description: this.forms.description.value,
					json: encodeURIComponent(JSON.stringify(json))
				});
				let res = await this.$axios.$post(
					this.type === 'edit' ? `/nests/${this.srl}/edit` : '/nests',
					data
				);
				console.log(res);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push('/nests');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				alert((e && typeof e === 'string') ? e : `Failed ${this.type} nest.`);
			}
		}
	}
}
</script>