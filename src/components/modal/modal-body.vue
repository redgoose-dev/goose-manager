<template>
<div
  :class="[
    'body',
    props.type === 'full' && 'body--full',
    props.type === 'window' && 'body--window',
  ]"
  @click.stop="">
  <slot/>
</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  type: string | 'full' | 'window'
}>()
</script>

<style lang="scss" scoped>
@use '../../assets/scss/mixins';
.body {
  position: relative;
  cursor: auto;
  background: var(--modal-window-background, var(--color-bg));
  box-sizing: border-box;
  &--window {
    border-radius: 2px;
    box-shadow:
      var(--modal-window-shadow-1, 0 4px 20px rgb(0 0 0 / 20%)),
      var(--modal-window-shadow-2, 0 0 0 1px rgb(0 0 0 / 10%));
  }
  &--full {
    width: 100%;
    height: 100%;
  }
  @include mixins.dark-mode() {
    &--window {
      --modal-window-shadow-1: 0 4px 24px rgb(0 0 0 / 25%);
      --modal-window-shadow-2: 0 0 0 1px rgb(255 255 255 / 8%);
    }
  }
}
</style>
