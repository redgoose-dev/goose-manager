<template>
<component
  :is="tag"
  :contenteditable="!disabled"
  @input="onInput"
  @blur="onBlur"
  @paste="onPaste"
  @keydown.meta.enter="$emit('submit')"
  @keyup.ctrl.enter="$emit('submit')"
/>
</template>

<script>
export default {
  name: 'content-editable',
  props: {
    tag: { type: String, default: 'div' },
    value: { type: String },
    disabled: { type: Boolean, default: false },
  },
  mounted() {
    this.$el.innerText = this.value;
  },
  watch: {
    'value': function (value)
    {
      if (value !== this.$el.innerText)
      {
        this.$el.innerText = this.value;
      }
    }
  },
  methods: {
    onInput(e)
    {
      this.$emit('input', e.target.innerText);
    },
    onBlur(e)
    {
      this.$emit('input', e.target.innerText);
    },
    onPaste(e)
    {
      e.preventDefault();
      if (!window) return;
      let text = (e.originalEvent || e).clipboardData.getData('text/plain');
      window.document.execCommand('insertText', false, text);
    },
  },
}
</script>

<style scoped>
div {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}
div[contenteditable=false] {
  cursor: not-allowed;
}
</style>
