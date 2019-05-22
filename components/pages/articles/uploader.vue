<template>
<div>
	<article ref="uploader" class="rg-uploader">
		<header v-if="parseInt(this.nest.json.useThumbnailSizeTool) === 1" class="rg-uploader-header">
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
		<div class="rg-uploader-body" data-comp="queue">
			<div class="col queue" data-element="queue">
				<ul></ul>
			</div>
		</div>
		<footer class="rg-uploader-footer">
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
					<span>Select</span>
				</button>
				<button type="button" @click="onOpenThumbnailPreviewImage">
					<i class="material-icons">zoom_in</i>
					<span>Preview thumbnail</span>
				</button>
				<button type="button" @click="onClearThumbnail">
					<i class="material-icons">delete</i>
					<span>Empty thumbnail</span>
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
import $ from 'jquery';
import * as util from '~/libs/util';
import 'rg-uploader/src/scss/index.scss';

const classBtnMakeThumbnail = '.btn-make-thumbnail';

export default {
	components: {
		'form-checks': () => import('~/components/form/checks'),
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
		const RG_Uploader = require('rg-uploader/src/component');
		const plugins = require('rg-uploader/src/plugins');
		let { $store, nest, files } = this;
		let uploader;
		if (!nest.json.files) nest.json.files = {};

		// make uploader instance
		uploader = this.uploader = new RG_Uploader.default(this.$refs.uploader, {
			autoUpload: true,
			allowFileTypes : ['jpeg', 'jpg', 'png', 'gif', 'zip', 'pdf', 'txt', 'swf', 'c4d'],
			limitSize: nest.json.files.sizeSingle || 3000000,
			limitSizeTotal: nest.json.files.sizeTotal || 10000000,
			uploadScript: `${$store.state.url_api}/files`,
			removeScript: `${$store.state.url_api}/files`,
			uploadHeaders: {
				Authorization: $store.state.authUser.token,
			},
			srcPrefixName: `${$store.state.url_api}/`,
			queue: {
				style: 'list', // list,web,album
				height: 180,
				limit: nest.json.files.count || 30,
				datas: files,
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
							let str = `\n`;
							str += file.type && file.type.split('/')[0] === 'image' ? '!' : '';
							str += `[${file.name}](${file.fullSrc})`;
							str += `\n`;
							this.$emit('insertEditor', str);
						},
					},
					{
						name: 'remove queue',
						iconName: 'close',
						action: (app, file) => app.queue.removeQueue(file.id, false, true)
					}
				]
			},
			plugin: [
				{ name: 'preview', obj: new plugins.Preview($) },
				{ name: 'sizeinfo', obj: new plugins.SizeInfo(undefined, $) },
				{ name: 'dnd', obj: new plugins.DragAndDrop(undefined, $) },
				{
					name: 'thumbnail',
					obj: new plugins.Thumbnail({
						width: 800,
						height: 700,
						mobileSize: 650,
						finalOutput : { type: 'base64', quality: .65, format: 'jpeg' },
						doneCallback: (res, app, file) => this.makeThumbnail(res, app, file).then()
					}, $)
				}
			],
			removeScriptFunc(url, file)
			{
				return `${url}/${file.srl}/delete`;
			},
			uploadParamsFilter(res)
			{
				/**
				 * 서버에 파라메터를 보낼때 ready 값을 보냅니다.
				 */
				return { ready: 1 };
			},
			uploadDataFilter(res)
			{
				if (res.success)
				{
					return res.data[0].status === 'success' ? {
						state: 'success',
						response: {
							src: `${res.data[0].loc}`,
							srl: parseInt(res.data[0].srl),
							name: res.data[0].name,
							type: res.data[0].type,
							ready: parseInt(res.data[0].ready),
						}
					} : {
						state: 'error',
						message: res.data[0].message,
					};
				}
				else
				{
					return {
						state: 'error',
						message: res.message,
					};
				}
			},
			removeDataFilter(res)
			{
				return {
					state: res.success ? 'success' : 'error',
					message: res.success ? null : res.message
				}
			},
			/**
			 * 파일 업로드가 완전히 끝나는 시점
			 *
			 * @param {object} res queue data
			 * @param {RG_Uploader} app
			 */
			uploadComplete(res, app)
			{
				/**
				 * 파일을 처음 올린다면 queue-id 값이 랜덤번호로 만들어져 있습니다.
				 * 이미 업로드되어있는 id값이랑 만들어지는 모습이 달라서 여러가지 오류가 생깁니다.
				 * 그래서 업로드가 끝나는 시점에서 수동으로 id 변경합니다.
				 */
				app.queue.changeId(res.id, res.srl);
			},
			init: (app) => this.init(app),
		});
		// set thumbnail options
		this.thumbnailOptions = null;
	},
	methods: {
		init(app)
		{
			// active thumbnail queue
			if (this.article && this.article.json.thumbnail && this.article.json.thumbnail.srl)
			{
				let $queue = app.queue.selectQueueElement(this.article.json.thumbnail.srl);
				$queue.find('.btn-make-thumbnail').addClass('on');
			}
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
				return `\n${prefix}[${file.name}](${file.fullSrc})`;
			}).join(`\n`);

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
			try
			{
				if (!this.uploader) throw 'error';

				if (this.thumbnailOptions && this.thumbnailOptions.src)
				{
					this.thumbnailPreviewImage = this.thumbnailOptions.src;
				}
				else if (this.article && this.article.json.thumbnail && this.article.json.thumbnail.path)
				{
					this.thumbnailPreviewImage = `${this.$store.state.url_api}/${this.article.json.thumbnail.path}`;
				}
				else
				{
					throw 'error';
				}
			}
			catch(e)
			{
				this.$toast.add({
					message: 'Not found thumbnail source',
					color: 'error',
				});
			}
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

			// restore points and zoom
			if (parseInt(file.srl) === app.queue.$queue.find('.btn-make-thumbnail.on').closest('li').data('id'))
			{
				if (this.thumbnailOptions && this.thumbnailOptions.points && this.thumbnailOptions.zoom)
				{
					option.points = this.thumbnailOptions.points;
					option.zoom = this.thumbnailOptions.zoom;
				}
				else if (article && article.thumbnail && article.thumbnail.points && article.thumbnail.zoom)
				{
					option.points = article.thumbnail.points;
					option.zoom = article.thumbnail.zoom;
				}
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
					quality : .65,
					size: {
						// 레티나를 위하여 사이즈 증가
						width: resource.width * 1.5,
						height: resource.height * 1.5
					}
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
		onClearThumbnail()
		{
			this.uploader.queue.$queue.find(classBtnMakeThumbnail).removeClass('on');
			this.thumbnailOptions = {};
		},
	}
};
</script>
<style src="./uploader.scss" lang="scss" scoped></style>