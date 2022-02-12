<template>
<svg
  :width="props.radius * 2"
  :height="props.radius * 2"
  class="progress-donut">
  <circle
    :stroke-width="props.stroke"
    :r="normalizedRadius"
    :cx="props.radius"
    :cy="props.radius"/>
  <circle
    :stroke-dasharray="`${circumference} ${circumference}`"
    :stroke-width="props.stroke"
    :r="normalizedRadius"
    :cx="props.radius"
    :cy="props.radius"
    :style="{ '--progress-donut-dash-offset': computedStrokeDashOffset }"/>
</svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  radius: { type: Number, default: 40 },
  stroke: { type: Number, default: 8 },
  percent: { type: Number, default: 0 },
});
const normalizedRadius = computed(() => (props.radius - props.stroke * 2));
const circumference = computed(() => (normalizedRadius.value * 2 * Math.PI));
const computedStrokeDashOffset = computed(() => {
  const percent = Math.min(props.percent, 100);
  return circumference.value - percent / 100 * circumference.value;
});
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
