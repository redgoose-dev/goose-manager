<template>
<nav
  ref="$root"
  :class="[
    'dropdown',
    props.mode && `mode--${props.mode}`,
    props.disabled && 'disabled',
  ]">
  <div
    role="button"
    class="trigger"
    @click="onClickTrigger">
    <slot v-if="$slots.trigger" name="trigger"/>
    <ButtonIcon
      v-else
      :icon-name="props.icon"
      :disabled="props.disabled"
      :class="[ _open && 'open' ]"/>
  </div>
  <transition name="fade">
    <div
      v-if="_open"
      :class="[
        'body',
        props.position && `position--${props.position}`,
      ]">
      <slot/>
    </div>
  </transition>
</nav>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { ButtonIcon } from '../../button/index.js'

const $root = ref()
const props = defineProps({
  mode: { type: String, default: 'click' }, // click,hover
  position: { type: String, default: 'left' }, // left,right,top-left,top-right
  icon: { type: String, default: 'more-horizontal' },
  modelValue: Boolean,
  useValue: Boolean,
  disabled: Boolean,
})
const open = ref(false)
const emits = defineEmits([ 'update:modelValue' ])

const _open = computed(() => {
  if (props.mode === 'hover') return true
  return props.useValue ? open.value : props.modelValue
})

onUnmounted(() => {
  if (props.mode === 'click')
  {
    window.removeEventListener('click', onClickWindow)
    window.removeEventListener('touchend', onClickWindow)
  }
})

defineExpose({
  close: () => controlContext(false),
})

function onClickTrigger()
{
  if (props.mode !== 'click') return
  if (props.disabled) return
  controlContext(!_open.value)
}

function controlContext(sw)
{
  if (props.mode !== 'click') return
  if (sw)
  {
    window.addEventListener('click', onClickWindow)
    window.addEventListener('touchend', onClickWindow)
  }
  else
  {
    window.removeEventListener('click', onClickWindow)
    window.removeEventListener('touchend', onClickWindow)
  }
  if (props.useValue)
  {
    open.value = sw
  }
  else
  {
    emits('update:modelValue', sw)
  }
}

function onClickWindow(e)
{
  if ($root.value?.contains(e.target)) return
  controlContext(false)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
