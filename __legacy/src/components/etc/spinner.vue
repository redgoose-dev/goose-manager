<template>
<svg class="spinner" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="20" fill="none"></circle>
</svg>
</template>

<style lang="scss" scoped>
.spinner {
  display: block;
  width: var(--spinner-size, 50px);
  aspect-ratio: 1 / 1;
  stroke-width: var(--spinner-width, 4);
  box-sizing: border-box;
  animation: rotate var(--spinner-speed-1, 2000ms) linear infinite;
  circle {
    stroke: var(--color-base);
    stroke-linecap: round;
    animation: dash var(--spinner-speed-2, 1500ms) ease-in-out infinite;
  }
}
@keyframes rotate {
  100% { transform: rotate(360deg); }
}
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}
</style>
