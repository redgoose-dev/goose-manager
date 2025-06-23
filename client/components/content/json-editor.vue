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
  edit: { type: String, default: 'all' }, // all,value,none
})
const emits = defineEmits([ 'init', 'update:modelValue', 'context' ])

onMounted(() => {
  JsonEditor.prototype.updateLanguage = function()
  {
    this.lang = Object.assign(this.lang, {
      nodeChangeSort: '노드 순서변경',
      nodeContextMenu: '노드메뉴',
      nodeFold: '접기/펼치기',
      contextChangeType: '타입변경',
      contextInsertNode: '추가',
      contextTypeObject: '객체',
      contextTypeArray: '배열',
      contextTypeString: '문자',
      contextTypeNumber: '번호',
      contextTypeBoolean: '부울',
      contextTypeNull: '널',
      contextDuplicate: '복제',
      contextRemove: '삭제',
    })
  }
  jsonEditor = new JsonEditor($body.value, {
    live: true,
    theme: 'light',
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
  if (!jsonEditor) return
  jsonEditor.options.edit = value
})

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

defineExpose({
  closeContext,
  updateValue,
  updateData,
  foldAll,
  expandFolder,
})
</script>

<style lang="scss" scoped>
@use '../../scss/mixins';
.json-editor-wrap {
  position: relative;
  padding: 24px;
  background: var(--color-edge);
  border-radius: mixins.radius(64px);
  box-sizing: border-box;
  box-shadow: inset 0 0 0 .5px var(--color-weak);
  --json-editor-color-focus: var(--color-key);
}
</style>
