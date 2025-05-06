<template>
<div :class="[
  'modal-window',
  props.scroll && 'scroll',
]">
  <slot/>
</div>
</template>

<script setup>
const props = defineProps({
  scroll: Boolean,
})
</script>

<style lang="scss" scoped>
@use '../../scss/mixins';
.modal-window {
  position: relative;
  cursor: auto;
  width: var(--modal-window-width, 75vw);
  min-width: var(--modal-window-min-width, 460px);
  max-width: var(--modal-window-max-width, 640px);
  height: var(--modal-window-height, 65vh);
  min-height: var(--modal-window-min-width, 320px);
  max-height: var(--modal-window-max-height, 480px);
  box-sizing: border-box;
  border-radius: 8px;
  background: var(--modal-window-bg, var(--color-bg));
  box-shadow:
    0 8px 48px mixins.mix-alpha(var(--color-base), 20%),
    0 4px 16px mixins.mix-alpha(var(--color-base), 18%),
    0 0 0 .5px mixins.mix-alpha(var(--color-base), 15%);
  &.scroll {
    overflow: auto;
    @include mixins.custom-scrollbar();
  }
  &:not(.scroll) {
    overflow: clip;
  }
}
</style>
