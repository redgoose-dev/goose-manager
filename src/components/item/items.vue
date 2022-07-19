<template>
<div :class="[
  'items',
  props.theme && `items--theme-${props.theme}`,
]">
  <slot/>
</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  theme: string | 'list' | 'card' | 'thumbnail' | 'brick'
}>()
</script>

<style src="./items.scss" lang="scss" scoped></style>
