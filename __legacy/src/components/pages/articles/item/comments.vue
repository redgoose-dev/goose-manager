<template>
<section v-if="!loading" class="comments">
  <h1 class="comments__title">Comments</h1>
  <ul v-if="index.length > 0" class="comments__index">
    <li v-for="(comment, key) in index">
      <Comment
        :srl="comment.srl"
        :user-name="comment.user_name"
        :content="comment.content"
        :regdate="comment.regdate"
        @edit="content => onEditComment(key, content)"
        @delete="onDeleteComment(key)"/>
    </li>
  </ul>
  <CreateComment
    :article-srl="props.articleSrl"
    class="comments__create"
    @submit="onSubmitCreateComment"/>
</section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getComments } from '../../../../structure/comments'
import { err } from '../../../../libs/error'
import Comment from './comment.vue'
import CreateComment from './create-comment.vue'

const props = defineProps({
  articleSrl: { type: Number, required: true },
})
const index = ref([])
const loading = ref(false)

function onSubmitCreateComment(item)
{
  index.value.push(item)
}

function onEditComment(key, content)
{
  index.value[key].content = content
}
function onDeleteComment(key)
{
  index.value.splice(key, 1)
}

onMounted(async () => {
  try
  {
    loading.value = true
    index.value = await getComments(props.articleSrl)
    loading.value = false
  }
  catch (e)
  {
    loading.value = false
    err(['/components/pages/articles/item/comments.vue', 'onMounted()'], 'error', e.message)
  }
})
</script>

<style src="./comments.scss" lang="scss" scoped></style>
