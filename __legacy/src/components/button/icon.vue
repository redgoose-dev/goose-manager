<template>
<component :is="tag" v-bind="rootProps">
  <Icon :name="props.iconName" class="button-icon__body"/>
</component>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '../icons/index.vue'

const props = defineProps({
  type: String,
  iconName: String,
  href: String,
  target: String,
  title: String,
  disabled: Boolean,
  color: String, // key,sub,error,weak
  size: String, // small
})
const type = computed(() => {
  if (props.href) return /^http/.test(props.href) ? 'a' : 'router'
  else return props.type || ''
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
      break
    default:
      attr.type = props.type
      if (props.disabled) attr.disabled = props.disabled
      break
  }
  attr.class = [
    'button-icon',
    props.color && `color-${props.color}`,
    props.size && `size-${props.size}`,
    props.disabled && 'button-icon--disabled',
  ]
  return attr
})
</script>

<style src="./icon.scss" lang="scss" scoped></style>
