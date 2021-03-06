<template>
<div class="editor">
  <toolbar @click-item="onClickToolbarItem"/>
  <div class="editor__body">
    <textarea
      ref="textarea"
      :name="name"
      :id="id"
      :placeholder="placeholder"
      :value="value"
      :required="required"
      @click="onClickTextarea"
      @keyup="onKeyupTextarea"
      @input="onInputTextarea"
      @keyup.ctrl.enter="submit"
      @keydown.meta.enter="submit"/>
  </div>
  <div
    v-if="showPreview"
    class="preview"
    @click="showPreviewControl(false)">
    <article class="preview__wrap" @click.stop="">
      <div
        ref="preview"
        v-html="preview"
        class="redgoose-body redgoose-body--dark redgoose-body--popup"/>
    </article>
  </div>
</div>
</template>

<script>
import marked from 'marked';

export default {
  components: {
    'form-text': () => import('~/components/form/text'),
    'button-basic': () => import('~/components/button/basic'),
    'icon': () => import('~/components/icon'),
    'toolbar': () => import('~/components/pages/articles/post/editor-toolbar'),
  },
  props: {
    label: { type: String, default: 'Editor' },
    name: { type: String, default: 'editor' },
    id: { type: String, default: 'editor' },
    value: { type: [String,Number] },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },
  data()
  {
    return {
      showPreview: false,
      preview: '',
      start: 0,
      end: 0,
    };
  },
  mounted()
  {
    this.$nextTick(() => {
      this.$textarea = this.$refs.textarea;
      this.setSize();
    });
  },
  methods: {
    onClickTextarea(e)
    {
      this.onChangePosition(e.target);
    },
    onKeyupTextarea(e)
    {
      this.onChangePosition(e.target);
    },
    onInputTextarea(e)
    {
      this.$emit('input', e.target.value);
      this.resize();
    },
    onChangePosition(el)
    {
      if (!('selectionStart' in el)) return;
      this.$emit('change-position', {
        start: el.selectionStart,
        end: el.selectionEnd,
      });
    },
    showPreviewControl(sw)
    {
      // undefined sw
      if (sw === undefined) sw = !this.showPreview;
      if (sw)
      {
        if (!(this.value && this.value.length > 1))
        {
          this.$toast.add({
            message: 'The content is empty.',
            color: 'error',
          });
          return;
        }
        document.querySelector('html').classList.add('popup-modal-basic');
        this.showPreview = true;
        this.preview = marked(this.value);
        window.on('keyup.article-body-preview', (e) => {
          if (e.key === 'Escape') this.showPreviewControl(false);
        });
      }
      else
      {
        document.querySelector('html').classList.remove('popup-modal-basic');
        this.showPreview = false;
        this.preview = '';
        window.off('keyup.article-body-preview');
      }
    },
    /**
     * on click toolbar item
     * 툴바 버튼 클릭
     *
     * @param {string} key
     */
    onClickToolbarItem(key)
    {
      switch (key)
      {
        case 'insert-space':
          this.$emit('insert-text', `<p><br/></p>\n`);
          break;
        case 'insert-iframe':
          this.$emit('insert-text', `<div class="iframe"></div>\n`, 20);
          break;
        case 'insert-grid-group':
          this.$emit('insert-text', `<div class="grid-group">\n\n</div>\n`, 25);
          break;
        case 'insert-grid-item':
          this.$emit('insert-text', `<figure class="grid-item" data-mobile="3" data-tablet="" data-desktop="" data-desktop-large="">\n\n\n\n</figure>\n`, 97);
          break;
        case 'insert-picture':
          this.$emit('insert-text', `<picture>\n  <source srcset="" media="(prefers-color-scheme: dark)"/>\n  <source srcset="" media="(prefers-color-scheme: light)"/>\n  <img src="" alt=""/>\n</picture>`);
          break;
        case 'open-file-manager':
          this.$emit('open-files');
          break;
        case 'preview':
          this.showPreviewControl(true);
          break;
      }
    },
    resize()
    {
      this.$textarea.style.height = `auto`;
      this.setSize();
    },
    setSize()
    {
      this.$textarea.style.height = `${this.$textarea.scrollHeight}px`;
    },
    changeCursor(start, end)
    {
      this.$refs.textarea.setSelectionRange(start, end);
      this.$refs.textarea.focus();
      this.resize();
    },
    submit()
    {
      this.$emit('submit');
    },
  }
}
</script>

<style src="./editor.scss" lang="scss" scoped/>
