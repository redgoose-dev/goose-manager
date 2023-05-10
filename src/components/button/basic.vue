<template>
<component :is="tag" v-bind="rootProps">
  <ButtonBody v-bind="bodyProps">
    <slot v-if="$slots.default"/>
  </ButtonBody>
</component>
</template>

<script setup>
import { computed } from 'vue'
import ButtonBody from './button-body.vue'

const props = defineProps({
  type: String, // label,button,submit,reset
  label: String,
  href: String,
  target: String,
  title: String,
  disabled: Boolean,
  size: String, // small
  color: String, // key,sub,error,weak
  inline: Boolean,
  rotateIcon: Boolean,
  iconLeft: String,
  iconRight: String,
  className: String,
  styles: undefined,
})
const type = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router'
  else return props.type || 'button'
})
const bodyProps = computed(() => {
  return {
    iconLeft: props.iconLeft,
    iconRight: props.iconRight,
    rotateIcon: props.rotateIcon,
  }
})
const tag = computed(() => {
  switch (type.value)
  {
    case 'a': return 'a'
    case 'router': return 'router-link'
    case 'label': return 'label'
    default: return 'button'
  }
})
const rootProps = computed(() => {
  let attr = {}
  if (props.title) attr.title = props.title
  switch (type.value)
  {
    case 'a':
      attr.href = props.href || '#'
      if (props.target) attr.target = props.target
      break
    case 'router':
      attr.to = props.href || '#'
      break
    case 'label':
      if (props.disabled) attr.disabled = props.disabled
      break
    default:
      attr.type = props.type || 'button'
      if (props.disabled) attr.disabled = props.disabled
      break
  }
  attr.class = [
    'button',
    props.size && `button--size-${props.size}`,
    props.color && `button--color-${props.color}`,
    props.inline && `button--inline`,
    props.rotateIcon && `button--animation`,
    props.className,
  ]
  attr.style = props.styles
  return attr
})
</script>

<style src="./basic.scss" lang="scss" scoped/>
