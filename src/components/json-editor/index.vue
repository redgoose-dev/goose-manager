<template>
<div class="json-editor-wrap">
  <div ref="$body"></div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import JsonEditor from '@redgoose/json-editor'
import { headStore } from '../../store/head.js'
import '@redgoose/json-editor/css'

let jsonEditor
const $body = ref()
const props = defineProps({
  modelValue: [ Object, Array, String ],
  disabled: Boolean,
  edit: { type: String, default: 'all' }, // all,value,none
})
const emits = defineEmits([ 'init', 'update:modelValue', 'context' ])
const head = headStore()

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

function foldAll(sw)
{
  let $nodes
  if (sw)
  {
    $nodes = jsonEditor.el.tree.find('.node.open:not(.root)')
    $nodes.removeClass('open')
  }
  else
  {
    $nodes = jsonEditor.el.tree.find('.node[data-type=object],.node[data-type=array]')
    $nodes.addClass('open')
  }
}

function expandFolder(depth = 0, node = undefined)
{
  if (depth === 0) return
  const $ = jsonEditor.$
  const $node = node ? $(node) : jsonEditor.el.tree.find('.root')
  let selector = []
  for (let i=0; i<depth; i++)
  {
    selector.push(`.node[data-depth='${i+1}']`)
  }
  let $nodes = $node
    .find(selector.join(','))
    .filter('[data-type=object],[data-type=array]')
    .addClass('open')
}

onMounted(() => {
  jsonEditor = new JsonEditor($body.value, {
    live: true,
    theme: head.theme,
    edit: props.edit,
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

watch(() => props.edit, value => {
  jsonEditor.options.edit = value
})

defineExpose({
  closeContext,
  updateValue,
  updateData,
  foldAll,
  expandFolder,
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
