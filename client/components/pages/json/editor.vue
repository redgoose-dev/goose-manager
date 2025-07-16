<template>
<fieldset class="editor">
  <legend>JSON Editor</legend>
  <Controller class="toolbar">
    <template #left>
      <ButtonGroup v-if="state.mode === 'editor'">
        <ButtonBasic
          label="모두 펼치기"
          size="small"
          icon-left="square-plus"
          @click="onClickFold(false)">
          모두 펼치기
        </ButtonBasic>
        <ButtonBasic
          label="접기"
          size="small"
          icon-left="square-minus"
          @click="onClickFold(true)">
          접기
        </ButtonBasic>
      </ButtonGroup>
      <ButtonBasic
        v-if="props.useAttachFile && state.mode === 'source'"
        title="첨부파일 관리자 열기"
        size="small"
        icon-left="archive"
        color="key"
        @click="openFileManager('source')">
        첨부파일
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic
          title="에디터에서 편집"
          icon-left="workflow"
          size="small"
          :color="state.mode === 'editor' ? 'key' : 'blur'"
          :disabled="state.mode === 'editor'"
          class="toggle-mode-button"
          @click="onClickChangeMode('editor')">
          에디터
        </ButtonBasic>
        <ButtonBasic
          title="소스코드 편집"
          icon-left="code"
          size="small"
          :color="state.mode === 'source' ? 'key' : 'blur'"
          :disabled="state.mode === 'source'"
          class="toggle-mode-button"
          @click="onClickChangeMode('source')">
          소스코드
        </ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
  <div class="editor__body">
    <FormTextarea
      v-if="state.mode === 'source'"
      ref="$source"
      :content="props.modelValue"
      v-model:position="state.position"
      name="json-source"
      id="json-source"
      :placeholder='`{ "foo": "bar" }`'
      :auto-size="true"
      :required="true"
      :readonly="props.readonly"
      class="source-editor"
      @update:content="emits('update:modelValue', $event)"
      @submit="emits('submit')"/>
    <JSONEditor
      v-else
      ref="$editor"
      :model-value="props.modelValue"
      :edit="props.readonly ? 'none' : 'all'"
      class="node-editor"
      @init="onInitJSONEditor"
      @update:model-value="emits('update:modelValue', $event)"
      @context="onContextEditor"/>
  </div>
</fieldset>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { Controller } from '../../navigation/index.js'
import { ButtonGroup, ButtonBasic } from '../../button/index.js'
import { FormTextarea } from '../../forms/index.js'
import { JSONEditor } from '../../content/index.js'

const $source = ref()
const $editor = ref()
const props = defineProps({
  modelValue: String,
  useAttachFile: Boolean,
  readonly: Boolean,
})
const emits = defineEmits([ 'update:modelValue', 'submit', 'open:file-manager' ])
const state = reactive({
  mode: 'editor',
  position: { start: 0, end: 0 },
})
let _jsonEditor
let _node

function onClickChangeMode(mode)
{
  state.mode = mode
  if (mode === 'editor')
  {
    state.position.start = 0
    state.position.end = 0
  }
}

function onInitJSONEditor(instance)
{
  _jsonEditor = instance
  $editor.value.expandFolder(2)
}

function onClickFold(sw)
{
  $editor.value.foldAll(sw)
}

function onContextEditor(e)
{
  const { body, node, type, isRoot, $ } = e
  switch (type)
  {
    case 'string':
      if (props.useAttachFile)
      {
        const $item = $(`<li><button type="button" data-mode="files"><em class="label">파일첨부 주소</em></button></li>`)
        $item.on('click', () => {
          _node = { node, $ }
          openFileManager('editor')
          $editor.value.closeContext()
        })
        $(body).find('li.remove').before($item)
      }
      break
  }
}

function openFileManager(mode)
{
  emits('open:file-manager', mode)
}

async function insert(src)
{
  switch (state.mode)
  {
    case 'source':
      if (state.position.start === 0) src = src.replace(/^\n/g, '')
      const content = props.modelValue.substring(0, state.position.start) + src + props.modelValue.substring(state.position.end)
      const pos = state.position.start + src.length
      emits('update:modelValue', content)
      nextTick().then(() => {
        $source.value.changeCursor(pos, pos)
        $source.value.focus()
      })
      break
    case 'editor':
      if (_node?.node) $editor.value.updateValue(_node.node, src)
      break
  }
}

defineExpose({
  insert,
  $editor,
})
</script>

<style src="./editor.scss" lang="scss" scoped></style>
