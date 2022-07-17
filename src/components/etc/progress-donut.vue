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
import { ref, computed } from 'vue'

interface Props {
  radius: number
  stroke: number
  percent: number
}

const props = defineProps<Props>()
const radius = ref<number>(props.radius || 40)
const stroke = ref<number>(props.stroke || 8)
const percent = ref<number>(props.percent || 0)
const normalizedRadius = computed<number>(() => (radius.value - stroke.value * 2))
const circumference = computed<number>(() => (normalizedRadius.value * 2 * Math.PI))
const computedStrokeDashOffset = computed<number>(() => {
  return circumference.value - Math.min(percent.value, 100) / 100 * circumference.value
})
</script>

<style lang="scss" scoped>
.progress-donut {
  circle {
    &:nth-child(1) {
      fill: transparent;
      stroke: var(--progress-donut-color-back, rgb(230 230 230));
    }
    &:nth-child(2) {
      fill: transparent;
      stroke: var(--progress-donut-color-fill, var(--color-key));
      transition: stroke-dashoffset 200ms ease-out;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      stroke-dashoffset: var(--progress-donut-dash-offset);
    }
  }
}
</style>
