<template>
<svg xmlns="http://www.w3.org/2000/svg">
  <use :xlink:href="path"/>
</svg>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  name: String,
  size: Number,
  strokeWidth: Number,
  color: String,
});
const path = computed(() => {
  return `/icons/${props.name}.svg#icon_${props.name}`;
});
</script>

<style lang="scss" scoped>
svg {
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  stroke-width: var(--icon-stroke-width, 2);
  color: var(--icon-color, unset);
}
</style>
