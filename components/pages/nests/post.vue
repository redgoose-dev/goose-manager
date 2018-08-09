<template>
<form @submit="onSubmit" ref="form">
	<section class="rg-form-section">
		<h1>Basic forms</h1>
		<div class="rg-form-section__body">
			<dl class="rg-form-field">
				<dt><label for="apps">App</label></dt>
				<dd>
					<form-select
						id="apps"
						name="apps"
						v-model="forms.app_srl.value"
						:options="apps"
						:required="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="id">ID</label></dt>
				<dd>
					<form-text
						id="id"
						name="id"
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
				<dt><label for="name">Name</label></dt>
				<dd>
					<form-text
						id="name"
						name="name"
						v-model="forms.name.value"
						:maxlength="40"
						:size="30"
						placeholder="Nest name"
						:inline="true"
						:required="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="description">Description</label></dt>
				<dd>
					<form-text
						id="description"
						name="description"
						v-model="forms.description.value"
						:maxlength="100"
						placeholder="Description word"/>
					<p class="rg-form-help">
						이 Nest에 대한 설명을 입력합니다.
					</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="skin">Skin</label></dt>
				<dd>
					<form-checks
						type="radio"
						name="skin"
						id="skin"
						v-model="json.skin"
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
			<dl class="rg-form-field">
				<dt><label for="article_skin">Article skin</label></dt>
				<dd>
					<form-checks
						type="radio"
						name="article_skin"
						id="article_skin"
						v-model="json.articleSkin"
						:inline="true"
						:disabled="false"
						:items="[
							{ label: 'List', value: 'list' },
							{ label: 'Card', value: 'card' },
							{ label: 'Thumbnail', value: 'thumbnail' },
						]"/>
					<p class="rg-form-help">
						`Articles` 목록의 스킨입니다.
					</p>
				</dd>
			</dl>
		</div>
	</section>

	<section class="rg-form-section">
		<h1>Extra forms</h1>
		<component
			v-bind:is="`extra-${skin}`"
			class="rg-form-section__body"/>
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
		datas: {
			type: Object,
			apps: { type: Array },
			nest: { type: Object },
		},
	},
	data()
	{
		const { nest, apps } = this.datas;

		return {
			forms: {
				app_srl: {
					value: nest ? nest.app_srl : '',
					error: null,
				},
				id: {
					value: nest ? nest.id : '',
					error: null,
				},
				name: {
					value: nest ? nest.name : '',
					error: null,
				},
				description: {
					value: nest ? nest.description : '',
					error: null,
				},
			},
			apps: apps.map((o, k) => {
				return {
					label: `[${o.id}] ${o.name}`,
					value: o.srl,
				};
			}),
			nest: nest || {},
			json: {
				skin: (nest && nest.json.skin) ? nest.json.skin : 'default',
				articleSkin: (nest && nest.json.articleSkin) ? nest.json.articleSkin : 'thumbnail',
			},
			processing: false,
		};
	},
	computed: {
		typeLabel() {
			return (this.type === 'edit') ? 'Edit' : 'Add';
		},
		skin()
		{
			switch(this.json.skin)
			{
				case 'advanced':
					return 'advanced';
				case 'default':
				default:
					return 'default';
			}
		},
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

			try
			{
				this.processing = true;
				const data = formData({
					app_srl: this.forms.app_srl.value,
					id: this.forms.id.value,
					name: this.forms.name.value,
					description: this.forms.description.value,
					json: encodeURIComponent(JSON.stringify(json)),
				});
				let res = await this.$axios.$post(
					this.type === 'edit' ? `/nests/${this.srl}/edit` : '/nests',
					data
				);
				if (!res.success) throw res.message;
				this.processing = false;
				this.$router.push('/nests');
			}
			catch(e)
			{
				if (e === messages.error.service) e = null;
				this.processing = false;
				this.$toast.add({
					message: (e && typeof e === 'string') ? e : `Failed ${this.type} nest.`,
					color: 'error',
				});
			}
		}
	}
}
</script>