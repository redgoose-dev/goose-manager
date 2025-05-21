<template>
<component :is="_tag" v-bind="_rootProps">
  <Icon :name="props.iconName"/>
</component>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '../icon/index.vue'

const props = defineProps({
  type: String, // button,label
  iconName: String,
  href: String,
  target: String,
  title: String,
  disabled: Boolean,
  color: String, // key,sub,code,success,error,transparent
  size: String, // small
})

const _type = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router'
  else return props.type || ''
})
const _tag = computed(() => {
  switch (_type.value)
  {
    case 'a': return 'a'
    case 'router': return 'router-link'
    case 'label': return 'label'
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
      break
    default:
      attr.type = props.type
      if (props.disabled) attr.disabled = props.disabled
      break
  }
  attr.class = [
    'button-icon',
    props.color && `color--${props.color}`,
    props.size && `size--${props.size}`,
    props.disabled && 'disabled',
  ]
  return attr
})
</script>

<style src="./icon.scss" lang="scss" scoped></style>
