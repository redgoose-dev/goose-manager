<template>
<p class="progress">
  <ProgressDonut
    :percent="_percent"
    :radius="32"
    :stroke="5"/>
</p>
</template>

<script setup>
import { computed } from 'vue'
import ProgressDonut from '../../content/progress-donut.vue'

const props = defineProps({
  total: Number,
  loaded: Number,
})

const _percent = computed(() => {
  if (props.total === 0) return 0
  return Math.floor((props.loaded / props.total) * 100 * 100) / 100
})
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.progress {
  margin: 0;
  aspect-ratio: 1 / 1;
  background: var(--img-bg, #{mixins.mix-alpha(var(--color-blur), 50%)});
  box-sizing: border-box;
  display: grid;
  place-content: center;
  --progress-donut-color-back: var(--color-edge);
}
</style>
