<template>
<div class="comment">
  <div class="comment__body">
    <template v-if="editMode">
      <Textarea
        v-model="editContent"
        placeholder="Please input comment."
        :auto-size="true"
        :rows="3"
        @submit="onEdit"/>
      <nav>
        <div>
          <ButtonBasic size="small" @click="toggleEditMode(false)">
            Cancel
          </ButtonBasic>
        </div>
        <div>
          <ButtonBasic
            size="small"
            color="key"
            :disabled="editProcessing"
            @click="onEdit">
            {{editProcessing ? 'Processing..' : 'Edit comment'}}
          </ButtonBasic>
        </div>
      </nav>
    </template>
    <article v-else v-html="content" class="redgoose-body"/>
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

<script setup>
import { marked } from 'marked';
import { ref, onMounted, reactive, computed } from 'vue';
import { editComment, deleteComment } from '../../../../structure/comments';
import { message } from '../../../../message';
import { printf } from '../../../../libs/string';
import { toast } from '../../../../modules/toast';
import { Textarea } from '../../../forms';
import ButtonBasic from '../../../button/basic.vue';
import { err } from "../../../../libs/error.js";

const props = defineProps({
  srl: Number,
  userName: String,
  content: String,
  regdate: String,
});
const emits = defineEmits([ 'edit', 'delete' ]);
const editMode = ref(false);
const content = computed(() => marked(props.content));
const editContent = ref('');
const editProcessing = ref(false);
const deleteProcessing = ref(false);

function toggleEditMode(sw)
{
  editContent.value = sw ? props.content : '';
  editMode.value = sw;
}

async function onEdit()
{
  try
  {
    editProcessing.value = true;
    await editComment(props.srl, editContent.value);
    emits('edit', editContent.value);
    toggleEditMode(false);
    toast.add(printf(message.success.edit, message.word.comment), 'success');
    editProcessing.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'item', 'comment.vue', 'onEdit()' ], 'error', e.message);
    toast.add(printf(message.fail.edit, message.word.comment), 'error');
    editProcessing.value = false;
  }
}

async function onDelete()
{
  try
  {
    if (!confirm(printf(message.confirm.deleteItem, message.word.comment))) return;
    toggleEditMode(false);
    deleteProcessing.value = true;
    await deleteComment(props.srl);
    emits('delete');
    toast.add(printf(message.success.delete, message.word.comment), 'success');
    deleteProcessing.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'item', 'comment.vue', 'onDelete()' ], 'error', e.message);
    toast.add(printf(message.fail.delete, message.word.comment), 'error');
    deleteProcessing.value = false;
  }
}
</script>

<style src="./comment.scss" lang="scss" scoped></style>
