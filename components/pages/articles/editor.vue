<template>
<div class="rg-editor">
	<nav class="rg-editor__toolbar">
		<dl>
			<dt></dt>
			<dd>
				<slot name="nav"/>
			</dd>
		</dl>
	</nav>
	<div class="rg-editor__body">
		<form-text
			type="textarea"
			:name="name"
			:id="id"
			:placeholder="placeholder"
			:value="value"
			:rows="rows"
			:required="required"
			@position="onChangePosition"
			@change="onChangeText"
		/>
	</div>
	<div class="rg-editor__guide">
		<ul>
			<li>
				<a href="https://nolboo.kim/blog/2013/09/07/john-gruber-markdown/" target="_blank">
					존 그루버 마크다운 페이지 번역
				</a>
			</li>
			<li>
				<a href="https://gist.github.com/ihoneymon/652be052a0727ad59601" target="_blank">
					마크다운 사용법
				</a>
			</li>
		</ul>
	</div>

	<transition name="preview">
		<div v-if="previewWindow" class="preview" @click="onClickPreview">
			<article class="preview__wrap" @click="onClickPreviewWrap">
				<header>
					<h1>Content preview</h1>
					<nav>
						<button-circle-icon
							type="button"
							title="Setting"
							name="close"
							color="key"
							@onClick="offPreview"/>
					</nav>
				</header>
				<div ref="preview" v-html="preview" class="rg-article-body"></div>
			</article>
		</div>
	</transition>
</div>
</template>

<style lang="scss" src="./editor.scss" scoped></style>
<script>
import marked from 'marked';

let el_preview = null;

export default {
	components: {
		'FormText': () => import('~/components/form/text'),
		'ButtonBasic': () => import('~/components/button/basic'),
		'ButtonCircleIcon': () => import('~/components/button/circle-icon'),
	},
	props: {
		label: { type: String, default: 'Editor' },
		name: { type: String, default: 'editor' },
		id: { type: String, default: 'editor' },
		value: { type: [String,Number] },
		placeholder: { type: String },
		rows: { type: Number, default: 20 },
		required: { type: Boolean, default: false },
	},
	data()
	{
		return {
			previewWindow: false,
			preview: '',
		};
	},
	mounted()
	{
		el_preview = this.$refs.preview;
	},
	methods: {
		onChangeText(text)
		{
			this.$emit('input', text);
		},
		onChangePosition(op)
		{
			this.$emit('position', op);
		},
		onPreview(e)
		{
			if (!(this.value && this.value.length > 1))
			{
				this.$toast.add({
					message: 'The content is empty.',
					color: 'error',
				});
				return;
			}
			document.querySelector('html').classList.add('rg-mode-popup');
			this.previewWindow = true;
			this.preview = marked(this.value);
		},
		offPreview()
		{
			document.querySelector('html').classList.remove('rg-mode-popup');
			this.previewWindow = false;
			this.preview = '';
		},
		onClickPreview(e)
		{
			this.offPreview();
		},
		onClickPreviewWrap(e)
		{
			e.stopPropagation();
		}
	}
}
</script>
