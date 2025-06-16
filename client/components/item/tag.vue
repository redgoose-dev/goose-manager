<template>
<p :class="[
  'tag',
  props.color && `color--${props.color}`,
]">
  <component
    :is="props.useClick ? 'button' : 'span'"
    :type="props.useClick ? 'button' : undefined"
    class="body"
    @click="onClickBody">
    {{props.label}}
  </component>
  <button
    v-if="props.useRemove"
    type="button"
    class="remove"
    @click="onClickRemove">
    <Icon name="x"/>
  </button>
</p>
</template>

<script setup>
import Icon from '../icon/index.vue'

const props = defineProps({
  label: [ String, Number ],
  useClick: Boolean,
  useRemove: Boolean,
  color: String, // base,weak,blur,key,sub,code,success,error
})
const emits = defineEmits([ 'click', 'remove' ])

function onClickBody()
{
  if (!props.useClick) return
  emits('click', props.label)
}

function onClickRemove()
{
  emits('remove', props.label)
}
</script>

<style src="./tag.scss" lang="scss" scoped></style>
