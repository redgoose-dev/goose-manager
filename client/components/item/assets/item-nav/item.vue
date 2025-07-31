<template>
<component
  :is="_tag"
  v-bind="_rootProps"
  class="nav-item"
  @click="onClickButton">
  <slot/>
</component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: [ String, Object ],
  target: String,
  click: Function,
})
const _tag = computed(() => {
  if (props.href)
  {
    if (typeof props.href === 'string')
    {
      return /^http/.test(props.href) ? 'a' : 'router-link'
    }
    else
    {
      return 'router-link'
    }
  }
  else
  {
    return 'button'
  }
})
const _rootProps = computed(() => {
  let attr = {}
  switch (_tag.value)
  {
    case 'a':
      attr.href = props.href || '#'
      if (props.target) attr.target = props.target
      break
    case 'router-link':
      attr.to = props.href || '#'
      break
    case 'button':
      attr.type = 'button'
      break
  }
  return attr
})

function onClickButton(e)
{
  if (!props.click) return
  props.click(e)
}
</script>

<style lang="scss" scoped>
@use '../../../../scss/mixins';
.nav-item {
  display: block;
  line-height: 1.25;
  box-sizing: border-box;
  font-size: 12px;
  color: var(--color-base);
  font-weight: 600;
  letter-spacing: -.25px;
  outline: none;
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  &:is(a) {
    text-decoration: none;
  }
  &:is(button) {
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
  &:hover {
    text-decoration: underline;
  }
}
</style>
