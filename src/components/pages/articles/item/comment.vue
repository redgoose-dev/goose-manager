<template>
<div class="comment">
  <div class="comment__body">
    <template v-if="editMode">
      <FormTextarea
        v-model="editContent"
        placeholder="Please input comment."
        :auto-size="true"
        :rows="3"
        @submit="onEdit"/>
      <nav>
        <div>
          <ButtonBasic type="button" size="small" @click="toggleEditMode(false)">
            Cancel
          </ButtonBasic>
        </div>
        <div>
          <ButtonBasic
            type="button"
            size="small"
            color="key"
            :disabled="editProcessing"
            @click="onEdit">
            {{editProcessing ? 'Processing..' : 'Edit comment'}}
          </ButtonBasic>
        </div>
      </nav>
    </template>
    <article v-else v-html="content" class="redgoose-body redgoose-body--dark"/>
  </div>
  <div class="comment__bottom">
    <p><strong>{{props.userName}}</strong> commented <em>{{regdate}}</em></p>
    <nav>
      <button
        type="button"
        title="Edit"
        :disabled="editMode"
        class="edit"
        @click="toggleEditMode(true)">
        Edit
      </button>
      <button
        type="button"
        title="Delete"
        :disabled="deleteProcessing"
        class="delete"
        @click="onDelete">
        Delete
      </button>
    </nav>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import { editComment, deleteComment } from '../../../../structure/comments'
import { message } from '../../../../message'
import { printf } from '../../../../libs/string'
import { toast } from '../../../../modules/toast'
import { err } from '../../../../libs/error'
import { baseRenderer } from '../../../../modules/marked'
import { FormTextarea } from '../../../forms'
import { ButtonBasic } from '../../../button'

const props = defineProps<{
  srl: number
  userName: string
  content: string
  regdate: string
}>()
const emits = defineEmits([ 'edit', 'delete' ])
const renderer = baseRenderer()
const editMode = ref<boolean>(false)
const content = computed<string>(() => marked.parse(props.content, { renderer }))
const editContent = ref<string>('')
const editProcessing = ref<boolean>(false)
const deleteProcessing = ref<boolean>(false)

function toggleEditMode(sw: boolean): void
{
  editContent.value = sw ? props.content : ''
  editMode.value = sw
}

async function onEdit(): Promise<void>
{
  try
  {
    editProcessing.value = true
    await editComment(props.srl, editContent.value)
    emits('edit', editContent.value)
    toggleEditMode(false)
    toast.add(printf(message.success.edit, message.word.comment), 'success')
    editProcessing.value = false
  }
  catch (e: any)
  {
    err(['/components/pages/articles/item/comment.vue', 'onEdit()'], 'error', e.message)
    toast.add(printf(message.fail.edit, message.word.comment), 'error')
    editProcessing.value = false
  }
}

async function onDelete(): Promise<void>
{
  try
  {
    if (!confirm(printf(message.confirm.deleteItem, message.word.comment))) return
    toggleEditMode(false)
    deleteProcessing.value = true
    await deleteComment(props.srl)
    emits('delete')
    toast.add(printf(message.success.delete, message.word.comment), 'success')
    deleteProcessing.value = false
  }
  catch (e: any)
  {
    err(['/components/pages/articles/item/comment.vue', 'onDelete()'], 'error', e.message)
    toast.add(printf(message.fail.delete, message.word.comment), 'error').then()
    deleteProcessing.value = false
  }
}
</script>

<style src="./comment.scss" lang="scss" scoped></style>
