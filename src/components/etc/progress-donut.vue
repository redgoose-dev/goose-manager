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

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  radius?: number
  stroke?: number
  percent: number|string
}

const props = defineProps<Props>()
const radius = computed<number>(() => (props.radius || 40))
const stroke = computed<number>(() => (props.stroke || 8))
const normalizedRadius = computed<number>(() => (radius.value - stroke.value * 2))
const circumference = computed<number>(() => (normalizedRadius.value * 2 * Math.PI))
const computedStrokeDashOffset = computed<number>(() => {
  return circumference.value - Math.min(Number(props.percent as 0), 100) / 100 * circumference.value
})
</script>

<style src="./progress-donut.scss" lang="scss" scoped></style>
