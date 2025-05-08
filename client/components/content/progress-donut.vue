<template>
<svg
  xmlns="http://www.w3.org/2000/svg"
  :width="radius * 2"
  :height="radius * 2"
  class="progress-donut">
  <circle
    :stroke-width="stroke"
    :r="normalizedRadius"
    :cx="radius"
    :cy="radius"/>
  <circle
    :stroke-dasharray="`${circumference} ${circumference}`"
    :stroke-width="stroke"
    :r="normalizedRadius"
    :cx="radius"
    :cy="radius"
    :style="{ '--progress-donut-dash-offset': computedStrokeDashOffset }"/>
</svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  radius: Number,
  stroke: Number,
  percent: { type: [ Number, String ], required: true },
})
const radius = computed(() => (props.radius || 40))
const stroke = computed(() => (props.stroke || 8))
const normalizedRadius = computed(() => (radius.value - stroke.value * 2))
const circumference = computed(() => (normalizedRadius.value * 2 * Math.PI))
const computedStrokeDashOffset = computed(() => {
  return circumference.value - Math.min(Number(props.percent), 100) / 100 * circumference.value
})
</script>

<style src="./progress-donut.scss" lang="scss" scoped></style>
