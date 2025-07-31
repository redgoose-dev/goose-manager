<template>
<form class="create-comment" @submit.prevent="onSubmit">
  <PostToolbar
    :use-file-manager="false"
    :use-preview="true"
    class="toolbar"
    @select="onSelectToolbar"/>
  <FormTextarea
    ref="$contentEditor"
    name="comment-content"
    v-model:content="state.content"
    v-model:position="state.position"
    :auto-size="true"
    @submit="onSubmit"/>
  <nav class="submit">
    <ButtonBasic
      type="submit"
      size="small"
      color="key"
      icon-left="check">
      댓글쓰기
    </ButtonBasic>
  </nav>
  <teleport to="#modals">
    <Preview
      title="댓글 내용 미리보기"
      :content="state.preview"
      :private="true"
      @close="controlPreview(false)"/>
  </teleport>
</form>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { createComment } from '../../../structure/comment/index.js'
import { PostToolbar } from '../../navigation/index.js'
import { FormTextarea } from '../../forms/index.js'
import { ButtonGroup, ButtonBasic } from '../../button/index.js'
import { Preview } from '../../content/index.js'

const props = defineProps({
  module: { type: String, required: true },
  moduleSrl: { type: Number, required: true },
})
const emits = defineEmits([ 'submit' ])
const error = inject('error')
const errorPath = [ 'components', 'content', 'comment', 'create.vue' ]
const toast = inject('toast')
const $contentEditor = ref()
const state = reactive({
  processing: false,
  position: { start: 0, end: 0 },
  content: '',
  preview: '',
})

function controlPreview(sw)
{
  if (sw && !state.content)
  {
    toast.add('내용이 비었습니다.', 'error').then()
    return
  }
  state.preview = sw ? state.content : ''
}

function onSelectToolbar(code, value)
{
  switch (code)
  {
    case 'insert':
      $contentEditor.value.insert(value.code, value.cursor)
      break
    case 'preview':
      controlPreview(true)
      break
  }
}

async function onSubmit()
{
  if (!state.content)
  {
    toast.add('내용이 비었습니다.', 'error').then()
    return
  }
  try
  {
    state.processing = true
    const res = await createComment(props.module, props.moduleSrl, state.content)
    emits('submit', res)
    state.content = ''
    toast.add('댓글을 추가했습니다.', 'success').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: '댓글을 추가하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./create.scss" lang="scss" scoped></style>
