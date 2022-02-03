<template>
<div class="thumbnail-loading">
  <span :style="{ height: `${percent}%` }"/>
  <em :class="['thumbnail-loading__label', computedLabelColor]">
    {{percent}}% Uploading
  </em>
</div>
</template>

<script>
export default {
  name: 'thumbnail-loading',
  props: {
    percent: { type: Number, default: 0 },
  },
  computed: {
    computedLabelColor()
    {
      return this.percent > 50 ? 'light' : 'dark';
    },
  },
}
</script>

<style src="./thumbnail-loading.scss" lang="scss" scoped/>
