<template>
<svg :width="props.size" :height="props.size" :stroke-width="props.strokeWidth" :color="props.color">
  <use :xlink:href="path"/>
</svg>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  name: String,
  size: { type: Number, default: 24 },
  strokeWidth: { type: Number, default: 2 },
  color: String,
});
const path = computed(() => {
  return `/icons/${props.name}.svg#icon_${props.name}`;
});
</script>
