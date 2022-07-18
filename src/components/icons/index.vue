<template>
<svg xmlns="http://www.w3.org/2000/svg">
  <use :xlink:href="path"/>
</svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getPath } from '../../libs/string'

interface Props {
  name: string
  size?: number
  strokeWidth?: number
  color?: string
}

const props = defineProps<Props>()
const path = computed(() => {
  return getPath(`${BASE_URL}/icons/${props.name}.svg#icon_${props.name}`)
})
</script>

<style lang="scss" scoped>
svg {
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  stroke-width: var(--icon-stroke-width, 2);
  color: var(--icon-color, unset);
}
</style>
