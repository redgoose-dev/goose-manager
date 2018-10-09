<template>
<div>
	<form @submit="onSubmit" ref="form">
		<fieldset class="rg-form-fieldset">
			<legend>{{type}} article form</legend>
			<dl v-if="datas.categories && datas.categories.length" class="rg-form-field">
				<dt><label for="category">Category</label></dt>
				<dd>
					<form-select
						name="category"
						id="category"
						v-model="forms.category_srl"
						:options="datas.categories"
						:required="false"
						:inline="true"/>
				</dd>
			</dl>
			<dl class="rg-form-field">
				<dt><label for="title">Title</label></dt>
				<dd>
					<form-text
						type="text"
						name="title"
						id="title"
						v-model="forms.title.value"
						placeholder="article title"
						:maxlength="120"
						:error="!!forms.title.error"
						:required="true"/>
				</dd>
			</dl>
		</fieldset>

		<editor
			ref="editor"
			name="content"
			id="content"
			v-model="forms.content.value"
			placeholder="article content body"
			:rows="18"
			:required="true"
			@position="onChangePosition"
			className="editor">
			<template slot="nav">
				<button-basic
					type="button"
					label="Preview"
					size="small"
					icon="visibility"
					color="gray"
					:inline="true"
					@onClick="(e) => $refs.editor.onPreview(e)"/>
			</template>
		</editor>

		<uploader
			ref="$uploader"
			:article="datas.article"
			:files="datas.files"
			:nest="datas.nest"
			:options="{}"
			@insertEditor="insertFileToEditor"/>

		<nav class="rg-nav">
			<dl>
				<dt>
					<button-basic
						type="button"
						label="Drafts list"
						color="gray"
						:inline="true"
						@onClick="onOpenDraftWindow"/>
					<button-basic
						type="button"
						label="Save draft"
						color="key"
						:inline="true"
						@onClick="onSaveDraft"/>
				</dt>
				<dd>
					<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
					<button-basic
						type="submit"
						color="key"
						:label="!processing ? (this.type === 'edit' ? 'Edit Article' : 'Write Article') : null"
						:inline="true"
						:icon="processing ? 'cached' : ''"
						:rotateIcon="processing"
						:disabled="processing"/>
				</dd>
			</dl>
		</nav>
	</form>
	<drafts ref="drafts" :open="openDraftWindow" @attach="onAttachDraft"/>
</div>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';

export default {
	name: 'post-article',
	components: {
		'FormText': () => import('~/components/form/text'),
		'FormSelect': () => import('~/components/form/select'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Editor': () => import('~/components/pages/articles/editor'),
		'Uploader': () => import('~/components/pages/articles/uploader'),
		'Drafts': () => import('~/components/pages/articles/drafts'),
	},
	props: {
		type: { type: String, default: 'add' }, // add,edit
		srl: { type: [Number,String], default: null },
		nest_srl: { type: [Number,String] },
		category_srl: { type: [Number,String] },
		page: { type: [Number,String] },
		skin: { type: String, default: 'default' },
		datas: {
			type: Object,
			required: true,
			nest: { type: Object, required: true },
			categories: { type: Array, default: [] },
			article: { type: Object },
			files: { type: Array, default: [] },
		}
	},
	data()
	{
		return {
			processing: false,
			forms: {
				app_srl: this.datas.nest.app_srl,
				nest_srl: this.datas.article ? this.datas.article.nest_srl : this.nest_srl,
				category_srl: this.getCategoryInForm(),
				title: {
					value: this.datas.article ? this.datas.article.title : '',
					error: '',
				},
				content: {
					value: this.datas.article ? this.datas.article.content : '',
					error: '',
				},
				json: this.getJSON(),
			},
			editor: {
				start: 0,
				end: 0,
			},
			openDraftWindow: false,
		};
	},
	methods: {
		async onSubmit(e)
		{
			e.preventDefault();

			// set values
			const data_article = this.datas.article;
			const { $uploader } = this.$refs;
			let json = Object.assign({}, this.forms.json);

			// on loading
			this.processing = true;

			// merge uploader data
			let thumbnail = null;
			let updatedThumbnail = false;
			if ($uploader.thumbnailOptions)
			{
				// 이전 이미지는 삭제한다. 삭제 실패하더라도 넘어간다.
				if (!!(data_article && data_article.json.thumbnail))
				{
					await this.$axios.$post(
						`/files/remove-file`,
						formData({
							path: data_article.json.thumbnail.path
						})
					);
				}

				try
				{
					// 새로운 썸네일 이미지를 업로드한다.
					if ($uploader.thumbnailOptions.src)
					{
						let res_uploadSource = await this.$axios.$post(
							`/files/upload-file`,
							formData({
								sub_dir: 'thumbnail',
								file: $uploader.thumbnailOptions.src,
							})
						);
						if (!res_uploadSource.success) throw res_uploadSource.message;
						if (!res_uploadSource.data.path) throw 'not found source path';

						// make option
						thumbnail = {
							srl: $uploader.thumbnailOptions.srl,
							sizeSet: $uploader.sizeSet,
							points: $uploader.thumbnailOptions.points,
							zoom: $uploader.thumbnailOptions.zoom,
							path: res_uploadSource.data.path,
						};
					}
					else
					{
						// `$uploader.thumbnailOptions` 객체는 있지만 src가 없으면 썸네일 이미지를 삭제한다고 인식하고 값을 비워야 한다.
						thumbnail = null;
					}
					updatedThumbnail = true;
				}
				catch(e)
				{
					this.processing = false;
					this.$toast.add({ message: e, color: 'error' });
					return;
				}
			}

			try
			{
				// assign json
				if (updatedThumbnail) json.thumbnail = thumbnail;

				let data = {
					app_srl: this.forms.app_srl,
					nest_srl: this.forms.nest_srl,
					category_srl: this.forms.category_srl || '',
					title: this.forms.title.value,
					content: this.forms.content.value,
					json: encodeURIComponent(JSON.stringify(json)),
				};
				data = formData(data);
				let res = await this.$axios.$post(
					this.type === 'edit' ? `/articles/${this.srl}/edit` : '/articles',
					data
				);
				if (!res.success) throw res.message;

				// update files
				const files = this.$refs.$uploader.uploader.queue.items.files;
				if (files && files.length)
				{
					let srls = [];
					files.forEach((o) => {
						if (o.ready !== 1) return;
						srls.push(this.$axios.$post(
							`/files/${o.srl}/edit`,
							formData({
								article_srl: this.srl || res.srl,
								ready: 0
							})
						));
					});
					if (srls.length)
					{
						let res_file = await Promise.all(srls);
						for (let i=0; i<res_file.length; i++)
						{
							if (!res_file[i].success) throw res_file[i].message;
						}
					}
				}

				this.processing = false;
				// redirect
				let params = {};
				if (this.nest_srl) params.nest = this.nest_srl;
				if (this.category_srl) params.category = this.category_srl;
				if (this.page && this.page > 1) params.page = this.page;
				let url = `/articles/${this.srl || res.srl}/read${text.serialize(params, true)}`;
				this.$router.push(url);
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
		},
		getJSON()
		{
			if (!this.datas.article) return {};
			return Object.assign({}, this.datas.article.json);
		},
		getCategoryInForm()
		{
			if (this.datas.article) return this.datas.article.category_srl;
			if (this.category_srl === 'null') return null;
			return this.category_srl || null;
		},
		onChangePosition(op)
		{
			this.editor.start = op.start;
			this.editor.end = op.end;
		},
		insertFileToEditor(res)
		{
			let content = this.forms.content.value + '';
			let pos = this.editor.start;
			// 시작글자에서 붙인다면 처음 `\n`가 삭제됨
			if (pos === 0) res = res.replace(/^\n/g, '');
			this.forms.content.value = content.substr(0, pos) + res + content.substr(pos);
			this.editor.start += res.length;
		},
		onOpenDraftWindow()
		{
			this.$refs.drafts.open().then();
		},
		async onSaveDraft()
		{
			if (!this.forms.content.value)
			{
				this.$toast.add({
					color: 'error',
					message: `"content body" values are required.`,
				});
				return;
			}

			let description = prompt(messages.msg.inputDraftDescription);
			if (description === null) return;

			try
			{
				let res = await this.$axios.$post(`/drafts`, {
					title: this.forms.title.value,
					content: this.forms.content.value,
					description,
				});
				if (!res.success) throw res.message;

				this.$toast.add({
					color: 'success',
					message: 'Success save draft',
				});
			}
			catch(e)
			{
				this.$toast.add({ message: 'Failed save draft', color: 'error' });
			}
		},
		async onAttachDraft(values)
		{
			if (values.title) this.forms.title.value = values.title;
			if (values.content) this.forms.content.value = values.content;
		}
	}
}
</script>