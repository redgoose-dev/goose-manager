<template>
<div class="progress" :style="`--percent: ${props.percent}%`">
  <em>{{props.percent}}%</em>
</div>
</template>

<script setup>
const props = defineProps({
  percent: Number,
});
</script>

<style lang="scss" scoped>
@use '../../assets/scss/mixins';
.progress {
  position: relative;
  display: grid;
  align-content: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  background: rgb(var(--color-base-rgb) / 10%);
  border-radius: 2px;
  overflow: hidden;
  user-select: none;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--percent, 0);
    background: var(--color-key);
    transition: height 120ms linear;
  }
  em {
    position: relative;
    font-style: normal;
    color: rgb(255 255 255);
    font-weight: 400;
    font-size: 16px;
    line-height: 1.1;
    font-family: var(--font-eng);
  }
}
</style>
