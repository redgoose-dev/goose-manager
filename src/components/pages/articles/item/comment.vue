<template>
<div class="comment">
  <div class="comment__body">
    <template v-if="editMode">
      <FormTextarea
        v-model="editContent"
        placeholder="댓글을 입력해주세요."
        :auto-size="true"
        :rows="3"
        @submit="onEdit"/>
      <nav>
        <div>
          <ButtonBasic type="button" size="small" @click="toggleEditMode(false)">
            취소
          </ButtonBasic>
        </div>
        <div>
          <ButtonBasic
            type="button"
            size="small"
            color="key"
            :disabled="editProcessing"
            @click="onEdit">
            {{editProcessing ? '처리중입니다..' : '댓글 수정하기'}}
          </ButtonBasic>
        </div>
      </nav>
    </template>
    <article v-else v-html="content" class="redgoose-body redgoose-body--dark"/>
  </div>
  <div class="comment__bottom">
    <p><strong>{{props.userName}}</strong> <em>{{regdate}}</em></p>
    <nav>
      <button
        type="button"
        title="Edit"
        :disabled="editMode"
        class="edit"
        @click="toggleEditMode(true)">
        수정
      </button>
      <button
        type="button"
        title="Delete"
        :disabled="deleteProcessing"
        class="delete"
        @click="onDelete">
        삭제
      </button>
    </nav>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import { editComment, deleteComment } from '../../../../structure/comments'
import { toast } from '../../../../modules/toast'
import { err } from '../../../../libs/error'
import { baseRenderer } from '../../../../modules/marked'
import { FormTextarea } from '../../../forms'
import { ButtonBasic } from '../../../button'

const props = defineProps({
  srl: { type: Number, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  regdate: { type: String, required: true },
})
const emits = defineEmits([ 'edit', 'delete' ])
const renderer = baseRenderer()
const editMode = ref(false)
const content = computed(() => marked.parse(props.content, { renderer }))
const editContent = ref('')
const editProcessing = ref(false)
const deleteProcessing = ref(false)

function toggleEditMode(sw)
{
  editContent.value = sw ? props.content : ''
  editMode.value = sw
}

async function onEdit()
{
  try
  {
    editProcessing.value = true
    await editComment(props.srl, editContent.value)
    emits('edit', editContent.value)
    toggleEditMode(false)
    toast.add('댓글을 수정했습니다.', 'success').then()
    editProcessing.value = false
  }
  catch (e)
  {
    err(['/components/pages/articles/item/comment.vue', 'onEdit()'], 'error', e.message)
    toast.add('댓글을 수정하지 못했습니다.', 'error').then()
    editProcessing.value = false
  }
}

async function onDelete()
{
  try
  {
    if (!confirm('이 댓글을 삭제할까요?')) return
    toggleEditMode(false)
    deleteProcessing.value = true
    await deleteComment(props.srl)
    emits('delete')
    toast.add('댓글을 삭제했습니다.', 'success').then()
    deleteProcessing.value = false
  }
  catch (e)
  {
    err(['/components/pages/articles/item/comment.vue', 'onDelete()'], 'error', e.message)
    toast.add('댓글을 삭제하지 못했습니다.', 'error').then()
    deleteProcessing.value = false
  }
}
</script>

<style src="./comment.scss" lang="scss" scoped></style>
