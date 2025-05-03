<template>
<component
  :is="icon"
  :class="[
    'icon',
    `icon--${props.name}`,
    props.animation && `icon--animation-${props.animation}`,
  ]"/>
</template>

<script setup>
import { computed } from 'vue'
import map from './map.js'
import { toCamelCase } from '../../libs/strings.js'

const props = defineProps({
  name: { type: String, required: true },
  animation: String, // spin
})

const icon = computed(() => {
  const func = map[props.name]
  if (func)
  {
    return func
  }
  else
  {
    console.warn('ICON WARNING:', props.name, toCamelCase(props.name))
    return undefined
  }
})
</script>

<style lang="scss" scoped>
.icon {
  display: block;
  margin: var(--icon-margin, 0);
  color: var(--icon-color, var(--color-base));
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  stroke-width: var(--icon-stroke, 2);
  animation: var(--icon-animation, none);
  transition: var(--icon-transition, none);
  &--animation-spin {
    --icon-animation: spin var(--icon-animation-speed, 2000ms) linear infinite;
  }
}
</style>
