<template>
<component :is="props.tag" :class="[
  'modal-window',
  props.scroll && 'scroll',
]">
  <slot/>
</component>
</template>

<script setup>
const props = defineProps({
  tag: { type: String, default: 'div' },
  scroll: Boolean,
})
</script>

<style lang="scss" scoped>
@use '../../scss/mixins';
.modal-window {
  position: relative;
  cursor: auto;
  width: var(--modal-window-width, auto);
  min-width: var(--modal-window-min-width, auto);
  max-width: var(--modal-window-max-width, none);
  height: var(--modal-window-height, auto);
  min-height: var(--modal-window-min-width, none);
  max-height: var(--modal-window-max-height, none);
  box-sizing: border-box;
  border-radius: mixins.radius(160px);
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
