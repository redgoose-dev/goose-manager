<template>
<svg
  :width="radius * 2"
  :height="radius * 2"
  class="graph-donut">
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
    :style="{ strokeDashoffset: computedStrokeDashOffset }"/>
</svg>
</template>

<script>
export default {
  name: 'graph-donut',
  props: {
    radius: { type: Number, default: 40 },
    stroke: { type: Number, default: 8 },
    percent: { type: Number, default: 0 },
  },
  data()
  {
    const normalizedRadius = this.radius - this.stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    return {
      normalizedRadius,
      circumference,
    };
  },
  computed: {
    computedStrokeDashOffset()
    {
      const percent = Math.min(this.percent, 100);
      return this.circumference - percent / 100 * this.circumference;
    },
  },
}
</script>

<style lang="scss" scoped>
.graph-donut {
  circle {
    &:nth-child(1) {
      fill: transparent;
      stroke: var(--color-stroke-back, var(--color-content-bg));
    }
    &:nth-child(2) {
      fill: transparent;
      stroke: var(--color-stroke, var(--color-key));
      transition: stroke-dashoffset 200ms;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
  }
}
</style>
