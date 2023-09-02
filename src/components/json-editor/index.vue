<template>
<div class="json-editor-wrap">
  <div ref="$body"></div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import JsonEditor from '@redgoose/json-editor'
import '@redgoose/json-editor/css'

let jsonEditor
const $body = ref()
const props = defineProps({
  modelValue: [ Object, Array, String ],
  disabled: Boolean,
  theme: { type: String, default: 'system' }, // system,light,dark
})
const emits = defineEmits([ 'init', 'update:modelValue', 'context' ])

function updateData(value, useUpdate)
{
  try
  {
    if (!value) throw new Error('no data')
    const data = (typeof value === 'string') ? JSON.parse(value) : value
    jsonEditor.replace(data, useUpdate)
  }
  catch (_) {}
}

function onUpdateEditor({ detail })
{
  emits('update:modelValue', JSON.stringify(detail, null, 2))
}

function onContextEditor({ detail })
{
  emits('context', detail)
}

function closeContext()
{
  if (!jsonEditor.context) return
  jsonEditor.context.close()
}

function updateValue(node, value)
{
  jsonEditor.changeValue(node, value)
}

onMounted(() => {
  jsonEditor = new JsonEditor($body.value, {
    live: true,
    theme: props.theme,
  })
  $body.value.addEventListener('update', onUpdateEditor)
  $body.value.addEventListener('context', onContextEditor)
  updateData(props.modelValue, false)
  emits('init', jsonEditor)
})

onBeforeUnmount(() => {
  $body.value.removeEventListener('update', onUpdateEditor)
  $body.value.removeEventListener('context', onContextEditor)
  jsonEditor.destroy()
  jsonEditor = undefined
})

watch(() => props.theme, value => {
  jsonEditor.options.theme = value
})

defineExpose({
  closeContext,
  updateValue,
  updateData,
})
</script>

<style lang="scss" scoped>
@use '../../assets/scss/mixins';
.json-editor-wrap {
  position: relative;
  background: hsl(0 0% 94%);
  padding: 24px;
  border-radius: 2px;
  box-sizing: border-box;
  --json-editor-color-focus: var(--color-key);
  @include mixins.dark-mode() {
    background: hsl(0 0% 12%);
  }
}
</style>
