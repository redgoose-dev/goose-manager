<template>
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
		className="editor"/>

	<uploader
		ref="$uploader"
		:article="datas.article"
		:files="datas.files"
		:nest="datas.nest"
		:options="{}"
		@insertEditor="insertFileToEditor"/>

	<nav class="rg-nav">
		<button-basic type="button" label="Back" onClick="history.back()" :inline="true"/>
		<button-basic
			type="submit"
			color="key"
			:label="!processing ? (this.type === 'edit' ? 'Edit Article' : 'Write Article') : null"
			:inline="true"
			:icon="processing ? 'cached' : ''"
			:rotateIcon="processing"
			:disabled="processing"/>
	</nav>
</form>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';

/**
 * json data tree
 * {
 *   thumbnail: {
 *     srl, // file srl
 *     sizeSet, // `1*1`
 *     points, // edit position
 *     zoom, // edit zoom
 *     url, // image url
 *   }
 * }
 */

// TODO: 썸네일이 설정된 이미지가 삭제되었을때 업로드 컴포넌트에서의 옵션 데이터 비우기
// TODO: 썸네일 이미지가 없을때도 있기 때문에 데이터가 없다고 오류나는 현상 안일어나게 검사하기

export default {
	components: {
		'FormText': () => import('~/components/form/text'),
		'FormSelect': () => import('~/components/form/select'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'Editor': () => import('~/components/pages/articles/editor'),
		'Uploader': () => import('~/components/pages/articles/uploader'),
	},
	props: {
		type: { type: String, default: 'add' }, // add,edit
		srl: { type: [Number,String], default: null },
		nest_srl: { type: [Number,String] },
		category_srl: { type: [Number,String] },
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

			console.log(data_article);
			return;

			// merge uploader data
			// TODO: 수정모드에서 썸네일 이미지가 삭제되었을수도 있음.
			if ($uploader.thumbnailOptions)
			{
				// TODO: 수정할때 썸네일 이미지를 건드리지 않을수도 있음.
				try
				{
					// TODO: 기존 썸네일이 있다면 이미지 삭제
					let res_uploadSource = await this.$axios.$post(
						`/files/upload-file`,
						formData({
							sub_dir: 'thumbnail',
							file: $uploader.thumbnailOptions.src,
						})
					);
					if (!res_uploadSource.success) throw res_uploadSource.message;
					if (!res_uploadSource.data.path) throw 'not found source path';

					json.thumbnail = {
						srl: $uploader.thumbnailOptions.srl,
						sizeSet: $uploader.sizeSet,
						points: $uploader.thumbnailOptions.points,
						zoom: $uploader.thumbnailOptions.zoom,
						path: res_uploadSource.data.path,
						fullPath: `${this.$store.state.url_api}/${res_uploadSource.data.path}`,
					};
				}
				catch(e)
				{
					this.processing = false;
					this.$toast.add({
						message: 'Failed make thumbnail image',
						color: 'error'
					});
					return;
				}
				//console.log($uploader.thumbnailOptions);
				// TODO: 업로더에 들어있는 데이터 붙이기
				// TODO: 썸네일 이미지 업로드
			}

			console.log(json);
			return;

			try
			{
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
				params.nest = this.nest_srl;
				if (this.category_srl) params.category = this.category_srl;
				let url = `/articles/${this.srl || res.srl}/read${text.serialize(params, true)}`;
				this.$router.replace(url);
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
			try
			{
				return JSON.parse(decodeURIComponent(this.datas.article.json));
			}
			catch(e)
			{
				return {};
			}
		},
		getCategoryInForm()
		{
			if (this.datas.article) return this.datas.article.category_srl;
			if (this.category_srl === 'null') return null
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
			this.forms.content.value = content.substr(0, pos) + res + content.substr(pos);
			this.editor.start += res.length;
		}
	}
}
</script>