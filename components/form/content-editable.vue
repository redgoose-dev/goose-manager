<template>
<component
  :is="tag"
  :contenteditable="true"
  @input="update"
  @blur="update"
  @paste="paste"/>
</template>

<script>
export default {
  name: 'content-editable',
  props: {
    tag: { type: String, default: 'div' },
    value: { type: String },
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
    update(e)
    {
      this.$emit('input', e.target.innerText);
    },
    paste(e)
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
</style>
