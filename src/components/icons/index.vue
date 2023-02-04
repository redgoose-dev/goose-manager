<template>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  :class="[
  'icon',
  `icon--${props.name}`,
  props.rotate && 'rotate',
]">
  <use :href="`/images/feather-sprite.svg#${props.name}`"/>
</svg>
</template>

<script lang="ts" setup>
interface Props {
  name: string
  rotate?: boolean
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.icon {
  display: block;
  margin: var(--icon-margin, 0);
  color: var(--icon-color, var(--color-base));
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  stroke-width: var(--icon-stroke, 2);
  animation: var(--icon-animation, none);
  transition: var(--icon-transition, none);
  &.rotate {
    --icon-animation: icon-spin 2s linear infinite;
  }
}
</style>
