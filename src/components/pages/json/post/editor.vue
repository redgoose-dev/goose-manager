<template>
<fieldset class="editor">
  <legend>JSON Editor</legend>
  <ToolbarWrap>
    <template #left>
      <ToolbarGroup v-if="mode === 'editor'">
        <ToolbarItem
          type="button"
          title="Expand"
          label="모두 펼치기"
          icon="plus-square"
          @click="onClickFold(false)"/>
        <ToolbarItem
          type="button"
          title="Fold"
          label="접기"
          icon="minus-square"
          @click="onClickFold(true)"/>
      </ToolbarGroup>
      <ToolbarGroup v-if="mode === 'source'">
        <ToolbarItem
          type="button"
          title="open file manager"
          label="첨부파일"
          icon="archive"
          color="key"
          @click="openFileManager('source')"/>
      </ToolbarGroup>
    </template>
    <template #right>
      <ToolbarGroup>
        <ToolbarItem
          type="button"
          title="Editor"
          label="에디터"
          icon="server"
          :color="mode === 'editor' ? 'key' : ''"
          :disabled="mode === 'editor'"
          @click="changeMode('editor')"/>
        <ToolbarItem
          type="button"
          title="Source code"
          label="소스코드"
          icon="code"
          :color="mode === 'source' ? 'key' : ''"
          :disabled="mode === 'source'"
          @click="changeMode('source')"/>
      </ToolbarGroup>
    </template>
  </ToolbarWrap>
  <div class="editor__body">
    <FormTextarea
      ref="$source"
      v-if="mode === 'source'"
      :model-value="props.modelValue"
      name="json"
      id="json"
      :rows="15"
      :placeholder='`{ "foo": "bar" }`'
      :required="true"
      @update:modelValue="emits('update:modelValue', $event)"
      @position="onUpdatePosition"
      @submit="emits('submit')"/>
    <JsonEditor
      v-else
      ref="$editor"
      :model-value="props.modelValue"
      :theme="head.theme"
      @init="onInitJsonEditor"
      @update:modelValue="emits('update:modelValue', $event)"
      @context="onContextEditor"/>
  </div>
</fieldset>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { headStore } from '../../../../store/head.js'
import { ToolbarWrap, ToolbarGroup, ToolbarItem } from '../../../navigation/toolbar'
import { FormTextarea } from '../../../forms'
import JsonEditor from '../../../json-editor/index.vue'

const $source = ref()
const $editor = ref()
const props = defineProps({
  modelValue: String,
})
const emits = defineEmits([ 'update:modelValue', 'submit', 'open-file-manager' ])
const head = headStore()
const mode = ref('editor') // editor,source
let editor = undefined
let jsonEditor
const position = reactive({ start: 0, end: 0 })

function changeMode(newValue)
{
  mode.value = newValue
  switch (mode.value)
  {
    case 'editor':
      onUpdatePosition({ start: 0, end: 0 })
      break
    case 'source':
      break
  }
}

function onUpdatePosition({ start, end })
{
  position.start = start
  position.end = end
}

function onContextEditor(e)
{
  const { body, node, type, isRoot, $ } = e
  switch (type)
  {
    case 'string':
      const $item = $(`<li><button type="button" data-mode="files"><em class="label">파일첨부 주소</em></button></li>`)
      $item.on('click', () => {
        editor = { node, $ }
        openFileManager('editor')
        $editor.value.closeContext()
      })
      $(body).find('li.remove').before($item)
      break
  }
}

function openFileManager(mode)
{
  emits('open-file-manager', {
    mode,
  })
}

async function insert(src)
{
  switch (mode.value)
  {
    case 'source':
      if (position.start === 0) src = src.replace(/^\n/g, '')
      const content = props.modelValue.substring(0, position.start) + src + props.modelValue.substring(position.end)
      const pos = position.start + src.length
      emits('update:modelValue', content)
      nextTick().then(() => {
        $source.value.changeCursor(pos, pos)
        $source.value.focus()
      })
      break
    case 'editor':
      $editor.value.updateValue(editor.node, src)
      break
  }
}

function onInitJsonEditor(instance)
{
  jsonEditor = instance
  $editor.value.expandFolder(3)
}

function onClickFold(sw)
{
  $editor.value.foldAll(sw)
}

defineExpose({
  insert,
})
</script>

<style src="./editor.scss" lang="scss" scoped></style>
