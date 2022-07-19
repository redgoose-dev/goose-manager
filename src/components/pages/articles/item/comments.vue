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

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getComments } from '../../../../structure/comments'
import { err } from '../../../../libs/error'
import Comment from './comment.vue'
import CreateComment from './create-comment.vue'

const props = defineProps<{
  articleSrl: number
}>()
const index = ref<any[]>([])
const loading = ref<boolean>(false)

function onSubmitCreateComment(item: any): void
{
  index.value.push(item)
}

function onEditComment(key: number, content: string): void
{
  index.value[key].content = content
}
function onDeleteComment(key: number): void
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
  catch (e: any)
  {
    loading.value = false
    err(['/components/pages/articles/item/comments.vue', 'onMounted()'], 'error', e.message)
  }
})
</script>

<style src="./comments.scss" lang="scss" scoped></style>
