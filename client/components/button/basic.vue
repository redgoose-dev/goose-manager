<template>
<component :is="_tag" v-bind="_rootProps">
  <ButtonBody v-bind="_bodyProps">
    <slot v-if="$slots.default"/>
  </ButtonBody>
</component>
</template>

<script setup>
import { computed } from 'vue'
import ButtonBody from './body.vue'

const props = defineProps({
  type: String, // label,button,submit,reset,text
  label: String,
  href: String,
  target: String,
  title: String,
  disabled: Boolean,
  size: String, // small
  color: String, // key,sub,error,weak
  rotateIcon: Boolean,
  iconLeft: String,
  iconRight: String,
})

const _type = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router'
  else return props.type || 'button'
})
const _bodyProps = computed(() => {
  return {
    iconLeft: props.iconLeft,
    iconRight: props.iconRight,
    rotateIcon: props.rotateIcon,
  }
})
const _tag = computed(() => {
  switch (_type.value)
  {
    case 'a': return 'a'
    case 'router': return 'router-link'
    case 'label': return 'label'
    case 'text': return 'p'
    default: return 'button'
  }
})
const _rootProps = computed(() => {
  let attr = {}
  if (props.title) attr.title = props.title
  switch (_type.value)
  {
    case 'a':
      attr.href = props.href || '#'
      if (props.target) attr.target = props.target
      break
    case 'router':
      attr.to = props.href || '#'
      break
    case 'label':
    case 'text':
      if (props.disabled) attr.disabled = props.disabled
      break
    default:
      attr.type = props.type || 'button'
      if (props.disabled) attr.disabled = props.disabled
      break
  }
  attr.class = [
    'button',
    props.size && `size--${props.size}`,
    props.color && `color--${props.color}`,
    props.rotateIcon && `ani-rotate`,
  ]
  return attr
})
</script>

<style src="./basic.scss" lang="scss" scoped/>
