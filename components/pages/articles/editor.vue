<template>
<div class="rg-editor">
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
      @change="onChangeText"/>
  </div>
  <div class="rg-editor__bottom">
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
    <nav class="rg-editor__toolbar">
      <slot name="nav"/>
    </nav>
  </div>

  <transition name="preview">
    <div v-if="previewWindow" class="preview" @click="onClickPreview">
      <article class="preview__wrap" @click="(e) => e.stopPropagation()">
        <div ref="preview" v-html="preview" class="rg-article-body"/>
      </article>
    </div>
  </transition>
</div>
</template>

<script>
import marked from 'marked';

let el_preview = null;

export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'button-basic': () => import('~/components/button/basic'),
  },
  props: {
    label: { type: String, default: 'Editor' },
    name: { type: String, default: 'editor' },
    id: { type: String, default: 'editor' },
    value: { type: [String,Number] },
    placeholder: { type: String, default: '' },
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
  }
}
</script>

<style lang="scss" src="./editor.scss" scoped/>
