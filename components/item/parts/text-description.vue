<template>
<p class="text-description">
  {{label}}
</p>
</template>

<script>
export default {
  name: 'text-description',
  props: {
    label: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";

.text-description {
  font-size: 11px;
  line-height: 1.5;
  color: mix(#fff, $color-blur, 25%);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
