<template>
<div class="comment">
  <div class="body">
    <form
      v-if="state.edit.active"
      class="editor"
      @submit.prevent="onSubmitEdit">
      <PostToolbar
        :use-file-manager="true"
        :use-preview="true"
        @select="onSelectToolbar"/>
      <FormTextarea
        ref="$contentEditor"
        name="comment-content"
        v-model:content="state.edit.content"
        v-model:position="state.edit.position"
        :auto-size="true"
        @submit="onSubmitEdit"/>
      <footer>
        <ButtonGroup size="small">
          <ButtonBasic
            size="small"
            icon-left="x"
            @click="toggleEditMode">
            취소
          </ButtonBasic>
          <ButtonBasic
            type="submit"
            size="small"
            icon-left="check"
            color="key"
            :disabled="state.edit.processing">
            {{state.edit.processing ? '처리중..' : '댓글 수정하기'}}
          </ButtonBasic>
        </ButtonGroup>
      </footer>
    </form>
    <div
      v-else
      v-html="_content"
      class="content-body redgoose-body redgoose-body--popup"/>
  </div>
  <footer class="footer">
    <p class="footer__date">{{_regdate}}</p>
    <nav class="footer__control">
      <button
        type="button"
        :class="[
          'edit',
          state.edit.active && 'active',
        ]"
        @click="toggleEditMode">
        <Icon :name="state.edit.active ? 'book-open' : 'edit'"/>
        <span>{{state.edit.active ? '읽기' : '수정'}}</span>
      </button>
      <button
        type="button"
        class="delete"
        @click="onClickDelete">
        <Icon name="trash-2"/>
        <span>삭제</span>
      </button>
    </nav>
  </footer>
  <teleport to="#modals">
    <Modal
      :open="state.edit.openFileManager"
      mode="full"
      :scroll="true"
      :shortcut="true"
      @close="state.edit.openFileManager = false">
      <FileManager
        module="comment"
        :module-srl="props.srl"
        :shortcut="true"
        :private="true"
        :multiple-selection="true"
        file-key="code"
        @insert="onInsertFileManager">
        <template #header>
          <ModalHeader
            title="댓글 첨부파일"
            icon="file-search"
            @close="state.edit.openFileManager = false"/>
        </template>
      </FileManager>
    </Modal>
    <Preview
      title="댓글 내용 미리보기"
      :content="state.edit.preview"
      :private="true"
      @close="controlPreview(false)"/>
  </teleport>
</div>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { marked } from 'marked'
import { defaultOptions, baseRenderer, renderContent } from '../../../modules/marked.js'
import { editComment, deleteComment } from '../../../structure/comment/item.js'
import { dateFormat } from '../../../libs/date.js'
import { Preview } from '../../content/index.js'
import Icon from '../../icon/index.vue'
import { FormTextarea } from '../../forms/index.js'
import { ButtonGroup, ButtonBasic } from '../../button/index.js'
import { PostToolbar } from '../../navigation/index.js'
import { Modal, ModalHeader } from '../../modal/index.js'
import { FileManager } from '../../file-manager/index.js'

const props = defineProps({
  srl: Number,
  content: String,
  regdate: String,
})
const emits = defineEmits([ 'edit', 'delete' ])
const toast = inject('toast')
const error = inject('error')
const errorPath = [ 'components', 'content', 'comment', 'item.vue' ]
const $contentEditor = ref()
const state = reactive({
  edit: {
    active: false,
    content: '',
    openFileManager: false,
    preview: '',
    processing: false,
    position: { start: 0, end: 0 },
  },
  delete: {
    processing: false,
  },
})
const renderer = baseRenderer(null, {
  useHeadingLink: false,
})

const _content = computed(() => {
  const str = renderContent(props.content, true)
  return marked.parse(str, {
    ...defaultOptions,
    renderer,
  })
})
const _regdate = computed(() => {
  return dateFormat(new Date(props.regdate), '{yyyy}-{MM}-{dd} ({week}) {hh}:{mm}')
})

function toggleEditMode()
{
  state.edit.active = !state.edit.active
  state.edit.content = state.edit.active ? props.content : ''
}

function onSelectToolbar(code, value)
{
  switch (code)
  {
    case 'insert':
      $contentEditor.value.insert(value.code, value.cursor)
      break
    case 'open-file-manager':
      state.edit.openFileManager = true
      break
    case 'preview':
      controlPreview(true)
      break
  }
}

function controlPreview(sw)
{
  if (sw && !state.edit.content)
  {
    toast.add('내용이 비었습니다.', 'error').then()
    return
  }
  state.edit.preview = sw ? state.edit.content : ''
}

function onInsertFileManager(str)
{
  $contentEditor.value.insert(str)
  state.edit.openFileManager = false
}

async function onSubmitEdit()
{
  if (!state.edit.content)
  {
    toast.add('내용이 비었습니다.', 'error').then()
    return
  }
  try
  {
    state.edit.processing = true
    await editComment(props.srl, state.edit.content)
    emits('edit', state.edit.content)
    toggleEditMode()
    toast.add('댓글을 수정했습니다.', 'success').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmitEdit()' ],
      message: '댓글을 수정하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.edit.processing = false
  }
}

async function onClickDelete()
{
  try
  {
    if (!confirm('이 댓글을 삭제할까요?')) return
    state.delete.processing = true
    await deleteComment(props.srl)
    emits('delete')
    toast.add('댓글을 삭제했습니다.', 'success').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onClickDelete()' ],
      message: '댓글을 삭제하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.delete.processing = false
  }
}
</script>

<style src="./item.scss" lang="scss" scoped></style>
