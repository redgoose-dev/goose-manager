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
					<p v-if="!!forms.id.error" class="rg-form-help rg-form-help-error">
						{{forms.id.error}}
					</p>
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
		</div>
	</section>

	<section class="rg-form-section">
		<h1>Extra forms</h1>
		<div class="rg-form-section__body">
			<dl class="rg-form-field">
				<dt><label for="use_category">Using category</label></dt>
				<dd>
					<form-checks
						type="radio"
						name="use_category"
						id="use_category"
						v-model="json.useCategory"
						:inline="true"
						:disabled="false"
						:items="[
							{ label: 'Yes', value: 1 },
							{ label: 'No', value: 0 },
						]"/>
					<p class="rg-form-help">분류를 사용할지에 대하여 결정합니다.</p>
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
					<p class="rg-form-help">`Articles` 목록의 스킨입니다.</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="thumbnail_width">Thumnail</label></dt>
				<dd>
					<div>
						<label class="rg-form-field-inline">
							<span>Width:</span>
							<form-text
								id="thumbnail_width"
								name="thumbnail_width"
								v-model="json.thumbnail.width"
								placeholder="100"
								:maxlength="3"
								:size="5"
								:inline="true"/>
							<span>px</span>
						</label>
						<label class="rg-form-field-inline">
							<span>Height:</span>
							<form-text
								id="thumbnail_height"
								name="thumbnail_width"
								v-model="json.thumbnail.height"
								placeholder="100"
								:maxlength="3"
								:size="5"
								:inline="true"/>
							<span>px</span>
						</label>
					</div>
					<div>
						<form-checks
							type="radio"
							name="thumbnail_type"
							id="thumbnail_type"
							v-model="json.thumbnail.type"
							:inline="true"
							:disabled="false"
							:items="[
								{ label: 'crop', value: 'crop' },
								{ label: 'resize', value: 'resize' },
								{ label: 'resize(width)', value: 'resizeWidth' },
								{ label: 'resize(height)', value: 'resizeHeight' },
							]"/>
					</div>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="thumbnail_size_tool">Thumbnail size tool</label></dt>
				<dd>
					<form-checks
						type="radio"
						name="thumbnail_size_tool"
						id="thumbnail_size_tool"
						v-model="json.useThumbnailSizeTool"
						:inline="true"
						:disabled="false"
						:items="[
							{ label: 'Yes', value: 1 },
							{ label: 'No', value: 0 },
						]"/>
					<p class="rg-form-help">썸네일 사이즈 선택하는 툴을 사용합니다.</p>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="thumbnail_width">Files</label></dt>
				<dd>
					<div>
						<label class="rg-form-field-inline">
							<span>Count:</span>
							<form-text
								id="files_count"
								name="files_count"
								v-model="json.files.count"
								placeholder="10"
								:maxlength="2"
								:size="3"
								:inline="true"/>
						</label>
					</div>
					<div>
						<label class="rg-form-field-inline">
							<span>Size(single):</span>
							<form-text
								id="files_size_limit_single"
								name="files_size_limit_single"
								v-model="json.files.sizeSingle"
								placeholder="2000000"
								:maxlength="9"
								:size="15"
								:inline="true"/>
							<span>byte</span>
						</label>
						<label class="rg-form-field-inline">
							<span>Size(total):</span>
							<form-text
								id="files_size_total"
								name="files_size_total"
								v-model="json.files.sizeTotal"
								placeholder="15000000"
								:maxlength="9"
								:size="15"
								:inline="true"/>
							<span>byte</span>
						</label>
					</div>
				</dd>
			</dl>
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

		let result = {
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
				}
			},
			apps: apps.map((o, k) => {
				return {
					label: `[${o.id}] ${o.name}`,
					value: o.srl,
				};
			}),
			processing: false,
		};

		try
		{
			if (!nest) throw 'no nest';
			result.nest = nest;
			result.json = {
				useCategory: parseInt(nest.json.useCategory) || 0,
				articleSkin: nest.json.articleSkin,
				thumbnail: {
					width: parseInt(nest.json.thumbnail.width),
					height: parseInt(nest.json.thumbnail.height),
					type: nest.json.thumbnail.type,
				},
				useThumbnailSizeTool: parseInt(nest.json.useThumbnailSizeTool) || 0,
				files: {
					count: parseInt(nest.json.files.count),
					sizeSingle: parseInt(nest.json.files.sizeSingle),
					sizeTotal: parseInt(nest.json.files.sizeTotal)
				}
			};
		}
		catch(e)
		{
			result.nest = {};
			result.json = {
				useCategory: 0,
				articleSkin: 'card',
				thumbnail: {
					width: 300,
					height: 200,
					type: 'crop',
				},
				useThumbnailSizeTool: 0,
				files: {
					count: 15,
					sizeSingle: 3000000,
					sizeTotal: 30000000
				},
			};
		}

		console.log(result);
		return result;
	},
	computed: {
		typeLabel() {
			return (this.type === 'edit') ? 'Edit' : 'Add';
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