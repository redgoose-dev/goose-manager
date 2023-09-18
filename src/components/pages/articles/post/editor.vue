<template>
<fieldset :disabled="props.disabled" class="editor">
  <PostToolbar class="editor__toolbar" @select-item="onSelectToolbarItem"/>
  <div class="editor__body">
    <textarea
      ref="$textarea"
      :name="props.name"
      :id="props.id"
      :placeholder="props.placeholder"
      :required="props.required"
      :disabled="props.disabled"
      :value="props.modelValue"
      class="editor__content"
      :style="[ textareaHeight && `--editor-height: ${textareaHeight}` ]"
      @input="onInputTextarea"
      @click="changePosition"
      @keyup="changePosition"
      @keydown.meta.enter="emits('submit')"/>
  </div>
  <teleport to="#modals">
    <Preview
      :show="showPreview"
      :content="preview"
      @close="controlPreview(false)"/>
  </teleport>
</fieldset>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import { toast } from '../../../../modules/toast'
import { baseRenderer } from '../../../../modules/marked'
import * as elementCodes from '../../../../libs/element-codes.js'
import PostToolbar from '../../../navigation/post-toolbar.vue'
import Preview from '../../../content/preview.vue'

const $textarea = ref()
const props = defineProps({
  name: String,
  id: String,
  modelValue: String,
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
})
const emits = defineEmits([ 'update:modelValue', 'submit', 'open-file-manager' ])
const showPreview = ref(false)
const preview = ref('')
const position = ref({ start: 0, end: 0 })
const textareaHeight = ref('')

function onInputTextarea(e)
{
  emits('update:modelValue', e.target.value)
  resize()
}

function onSelectToolbarItem(key)
{
  switch (key)
  {
    case 'insert-space':
      insertText(elementCodes.space)
      break
    case 'insert-iframe':
      insertText(elementCodes.iframe.code, elementCodes.iframe.cursor)
      break
    case 'insert-grid-group':
      insertText(elementCodes.gridGroup.code, elementCodes.gridGroup.cursor)
      break
    case 'insert-grid-item':
      insertText(elementCodes.gridItem.code, elementCodes.gridItem.cursor)
      break
    case 'insert-picture':
      insertText(elementCodes.darkModeImage)
      break
    case 'open-file-manager':
      emits('open-file-manager')
      break
    case 'preview':
      controlPreview(true)
      break
  }
}

function insertText(text, cursor)
{
  if (!text) return
  let content = props.modelValue + ''
  const { start } = position.value
  if (start === 0) text = text.replace(/^\n/g, '')
  content = content.substr(0, start) + text + content.substr(start)
  emits('update:modelValue', content)
  let last = start + (cursor || text.length)
  position.value.start = last
  position.value.end = last
  nextTick().then(() => updateCursor())
}

function changePosition(e)
{
  if (!('selectionStart' in e.target)) return
  if (e.target.selectionStart > e.target.selectionEnd)
  {
    position.value.start = e.target.selectionEnd
    position.value.end = e.target.selectionStart
  }
  else
  {
    position.value.start = e.target.selectionStart
    position.value.end = e.target.selectionEnd
  }
}

function updateCursor()
{
  $textarea.value.setSelectionRange(position.value.start, position.value.end)
  $textarea.value.focus()
}

function resize()
{
  textareaHeight.value = 'unset'
  nextTick().then(() => {
    if (!$textarea.value) return
    textareaHeight.value = `${$textarea.value.scrollHeight}px`
  })
}

function controlPreview(sw)
{
  if (sw && !props.modelValue)
  {
    toast.add('이 내용은 비어있습니다.', 'error')
    return
  }
  if (sw)
  {
    const renderer = baseRenderer()
    preview.value = marked.parse(props.modelValue, { renderer })
  }
  else
  {
    preview.value = ''
  }
  showPreview.value = sw
}

async function changeCursor(start, end)
{
  position.value.start = start
  position.value.end = end
  await nextTick()
  $textarea.value.focus()
  $textarea.value.setSelectionRange(start, end)
  await nextTick()
  resize()
}

onMounted(() => resize())

defineExpose({
  position,
  changeCursor,
})
</script>

<style src="./editor.scss" lang="scss" scoped></style>
