<template>
<div :class="['preview-thumbnail', full && 'preview-thumbnail--full']">
  <figure class="preview-thumbnail__body">
    <img v-if="computedSrc" :src="computedSrc" alt="">
  </figure>
  <nav class="preview-thumbnail__nav">
    <div>
      <button-basic
        type="button"
        icon-left="x"
        @click.stop="$emit('close')">
        Close
      </button-basic>
    </div>
  </nav>
</div>
</template>

<script>
export default {
  name: 'preview-thumbnail',
  components: {
    'button-basic': () => import('~/components/button/basic'),
  },
  props: {
    path: { type: String, default: null },
    output: { type: String, default: null },
    full: { type: Boolean, default: false },
  },
  computed: {
    computedSrc()
    {
      if (this.output)
      {
        return this.output;
      }
      else if (this.path)
      {
        return `${this.$store.state.url_api}/${this.path}`;
      }
      else
      {
        return null;
      }
    },
  },
  mounted()
  {
    this.$emit('control-window', { action: 'open', code: 'preview-thumbnail' });
  },
  destroyed()
  {
    this.$emit('control-window', { action: 'close' });
  },
}
</script>

<style src="./preview-thumbnail.scss" lang="scss" scoped/>
