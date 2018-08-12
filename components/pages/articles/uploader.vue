<template>
<div>
	<article ref="uploader" class="rg-uploader">
		<header v-if="parseInt(this.nest.json.useThumbnailSizeTool) === 1">
			<h1>File uploader</h1>
			<form-checks
				type="radio"
				name="select_size_tool"
				id="select_size_tool"
				v-model="sizeSet"
				:inline="true"
				:disabled="false"
				:items="sizeToolItems"/>
			<p class="rg-form-help">
				`Nest`에서 정한 썸네일 이미지 사이즈에서의 비율을 정합니다. 기본 사이즈에서 2배수로 커지는 타입을 정합니다.
			</p>
		</header>
		<header v-else>
			<h1>File uploader</h1>
			<p>아래 업로드 버튼을 눌러서 파일을 추가합니다.</p>
		</header>
		<div class="body" data-comp="queue">
			<div class="col queue" data-element="queue">
				<ul></ul>
			</div>
		</div>
		<footer>
			<nav>
				<label class="add-file">
					<input type="file" data-element="addFiles" multiple>
					<i class="material-icons">add_circle_outline</i>
					<span>Add files</span>
				</label>
				<button type="button" @click="onAttachFiles">
					<i class="material-icons">play_for_work</i>
					<span>Attach file</span>
				</button>
				<button type="button" @click="onSelectAllToggleQueue">
					<i class="material-icons">crop_free</i>
					<span>Select queues</span>
				</button>
				<button type="button" @click="onOpenThumbnailPreviewImage">
					<i class="material-icons">zoom_in</i>
					<span>Preview thumbnail</span>
				</button>
			</nav>
			<div class="size-info"></div>
		</footer>
	</article>
	<figure
		v-if="thumbnailPreviewImage"
		@click="onCloseThumbnailPreviewImage"
		class="preview">
		<img
			:src="`${thumbnailPreviewImage}`"
			@click="(e) => { e.stopPropagation(); }"
			alt="preview image"/>
	</figure>
</div>
</template>

<script>
import RG_Uploader from 'rg-uploader';
import RG_Preview from 'rg-uploader/resource/plugins/preview.plugin';
import RG_SizeInfo from 'rg-uploader/resource/plugins/sizeinfo.plugin';
import RG_DragAndDrop from 'rg-uploader/resource/plugins/dnd.plugin';
import RG_Thumbnail from 'rg-uploader/resource/plugins/thumbnail.plugin';
import * as util from '~/libs/util';
import { formData } from '~/libs/forms';

export default {
	components: {
		'FormChecks': () => import('~/components/form/checks'),
	},
	props: {
		article: { type: Object },
		nest: { type: Object, required: true },
		files: { type: Array, default: [] },
		options: { type: Object },
	},
	computed: {
		sizeToolItems()
		{
			let w = this.nest.json.thumbnail.width;
			let h = this.nest.json.thumbnail.height;
			return [
				{ label: `${w}*${h}`, value: '1*1' },
				{ label: `${w*2}*${h}`, value: '2*1' },
				{ label: `${w}*${h*2}`, value: '1*2' },
				{ label: `${w*2}*${h*2}`, value: '2*2' },
			];
		}
	},
	data()
	{
		let data = {};
		data.sizeSet = (this.article && this.article.json.thumbnail) ? this.article.json.thumbnail.sizeSet : '1*1';
		data.thumbnailPreviewImage = null;
		return data;
	},
	mounted()
	{
		// make uploader instance
		this.uploader = new RG_Uploader(this.$refs.uploader, {
			autoUpload: true,
			allowFileTypes : ['jpeg', 'png', 'gif', 'zip', 'pdf', 'txt'],
			limitSize: this.nest.json.files.sizeSingle || 3000000,
			limitSizeTotal: this.nest.json.files.sizeTotal || 10000000,
			uploadScript: `${this.$store.state.url_api}/files`,
			removeScript: `${this.$store.state.url_api}/files`,
			uploadHeaders: {
				Authorization: this.$store.state.authUser.token,
			},
			srcPrefixName: `${this.$store.state.url_api}/`,
			queue: {
				style: 'list', // list,web,album
				height: 200,
				limit: this.nest.json.files.count || 30,
				datas: this.files,
				buttons: [
					{
						name: 'open file',
						iconName: 'open_in_new',
						action: (app, file) => window.open(file.fullSrc)
					},
					{
						name: 'make thumbnail image',
						iconName: 'apps',
						className: 'btn-make-thumbnail',
						show: (file) => (file.type.split('/')[0] === 'image'),
						action: (app, file) => this.onOpenMakeThumbnail(app, file).then(),
					},
					{
						name: 'insert editor',
						iconName: 'center_focus_strong',
						action: (app, file) => {
							let str = `![${file.name}](${file.fullSrc})\n\n`;
							this.$emit('insertEditor', str);
						}
					},
					{
						name: 'remove queue',
						iconName: 'close',
						action: (app, file) => app.queue.removeQueue(file.id, false, true)
					}
				]
			},
			plugin: [
				{ name: 'preview', obj: new RG_Preview() },
				{ name: 'sizeinfo', obj: new RG_SizeInfo() },
				{ name: 'dnd', obj: new RG_DragAndDrop() },
				{
					name: 'thumbnail',
					obj: new RG_Thumbnail({
						width: 800,
						height: 700,
						mobileSize: 650,
						finalOutput : { type: 'base64', quality: .85, format: 'jpeg' },
						doneCallback: (res, app, file) => this.makeThumbnail(res, app, file).then()
					})
				}
			],
			removeScriptFunc(url, file)
			{
				return `${url}/${file.srl}/delete`;
			},
			uploadParamsFilter(res)
			{
				return { ready: 1 };
			},
			uploadDataFilter(res)
			{
				return res.success ? {
					state: 'success',
					response: {
						src: `${res.data[0].loc}`,
						srl: parseInt(res.data[0].srl),
						name: res.data[0].name,
						ready: parseInt(res.data[0].ready),
					}
				} : {
					state: 'error',
					message: res.message,
				};
			},
			removeDataFilter(res)
			{
				return {
					state: res.success ? 'success' : 'error',
					message: res.success ? null : res.message
				}
			},
			init: (app) => this.init(app),
		});
		// set thumbnail options
		this.thumbnailOptions = null;
	},
	methods: {
		init(app)
		{
			// TODO: 썸네일 이미지 정보가 있으면(수정) 목록에서 아이콘 표시하기
		},
		onAttachFiles()
		{
			if (!this.uploader) return;

			const { queue } = this.uploader;
			let $selected = null;

			// check queue
			if (!queue.$queue.children('li').length) return;

			// find elements
			if (queue.$queue.children('li.selected').length)
			{
				$selected = queue.$queue.children('li.selected');
			}
			else if (confirm('전부 넣을까요?'))
			{
				$selected = queue.$queue.children('li');
			}
			else
			{
				return;
			}
			$selected = $selected.toArray();

			// make strings
			let str = $selected.map((item, key) => {
				const index = queue.findItem(parseInt(item.dataset.id));
				const file = queue.items.files[index];
				const prefix = /^image/.test(file.type) ? '!' : '';
				return `${prefix}[${file.name}](${file.fullSrc})`;
			}).join("\n\n");

			// output
			this.$emit('insertEditor', str);
		},
		onSelectAllToggleQueue()
		{
			if (!this.uploader) return;
			this.uploader.queue.selectQueue();
		},
		onOpenThumbnailPreviewImage()
		{
			if (!this.uploader) return;
			if (!(this.thumbnailOptions && this.thumbnailOptions.src))
			{
				this.$toast.add({
					message: 'Not found thumbnail source',
					color: 'error',
				});
				return;
			}
			this.thumbnailPreviewImage = this.thumbnailOptions.src;
		},
		onCloseThumbnailPreviewImage(e)
		{
			this.thumbnailPreviewImage = null;
		},
		async onOpenMakeThumbnail(app, file)
		{
			if (!(app.plugin.child.thumbnail && this.nest.json.thumbnail)) return;

			let option = {};
			let resource = {};
			const nest = this.nest.json;
			const article = this.article ? this.article.json : null;
			const plugin = app.plugin.child.thumbnail;

			// for edit
			if (article && article.thumbnail && parseInt(file.srl) === parseInt(article.thumbnail.srl))
			{
				option.points = article.thumbnail.points;
				option.zoom = article.thumbnail.zoom;
			}

			try
			{
				let size = {};
				switch(nest.thumbnail.type)
				{
					case 'crop':
						resource.width = parseInt(nest.thumbnail.width);
						resource.height = parseInt(nest.thumbnail.height);
						break;
					case 'resize':
					case 'resizeWidth':
					case 'resizeHeight':
						size = await util.getThumbnailSize({
							type: nest.thumbnail.type,
							width: parseInt(nest.thumbnail.width),
							height: parseInt(nest.thumbnail.height)
						}, file.fullSrc);
						resource.width = size.width;
						resource.height = size.height;
						break;
					default:
						throw 'type error';
				}
				if (!(resource.width && resource.height)) throw 'not found size';
				if (parseInt(nest.useThumbnailSizeTool) === 1)
				{
					let set = this.sizeSet.split('*');
					resource.width = resource.width * parseInt(set[0]);
					resource.height = resource.height * parseInt(set[1]);
				}
			}
			catch(e)
			{
				this.$toast.add({
					message: 'Failed open make thumbnail',
					color: 'error'
				});
				return;
			}

			plugin.assignOption({
				output: {
					type: 'base64',
					format: 'jpeg',
					quality : .85,
					size: { width: resource.width * 2, height: resource.height * 2 }
				},
				finalOutput : {
					size: { width: resource.width, height: resource.height }
				},
				croppie: {
					viewport: { width: resource.width, height: resource.height }
				}
			});
			plugin.open(file, option);
		},
		async makeThumbnail(res, app, file)
		{
			const classBtnMakeThumbnail = '.btn-make-thumbnail';

			// set thumbnail data
			const croppie = app.plugin.child.thumbnail.croppie.get();
			const options = app.plugin.child.thumbnail.options;

			// update thumbnail class in queue list
			app.queue.$queue.find(classBtnMakeThumbnail).removeClass('on');
			app.queue.selectQueueElement(file.id).find(classBtnMakeThumbnail).addClass('on');

			this.thumbnailOptions = {
				src: res.src,
				srl: file.srl,
				points: croppie.points,
				zoom: croppie.zoom,
				size: options.output.size,
			};
		},
		emptyThumbnail()
		{
			// TODO: 썸네일 이미지 비우기
			this.thumbnailOptions = null;
		}
	}
};
</script>

<style lang="scss" scoped>
.rg-uploader {
	margin: 30px 0 0;
}
.preview {
	position: fixed;
	z-index: 90;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(#000, .75);
	cursor: zoom-out;
	img {
		display: block;
		cursor: auto;
		max-width: 90%;
	}
}
</style>