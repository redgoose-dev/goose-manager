<template>
<div ref="$items" :class="[
  'items',
  props.theme && `theme--${props.theme}`,
]">
  <slot/>
</div>
</template>

<script setup>
const props = defineProps({
  theme: { type: String }, // list,card,thumbnail
})
</script>

<style src="./items.scss" lang="scss" scoped></style>
