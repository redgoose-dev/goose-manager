<template>
<div :class="[
  'items',
  props.theme && `items--theme-${props.theme}`,
]">
  <slot/>
</div>
</template>

<script setup>
const props = defineProps({
  theme: String, // list,card,thumbnail,brick
});
</script>

<style src="./items.scss" lang="scss" scoped></style>
