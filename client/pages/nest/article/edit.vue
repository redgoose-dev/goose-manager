<template>
<article>
  <PageHeader module="article" title="Edit Article"/>
  <Post
    ref="$post"
    mode="edit"
    :nest="Number(route.params.nest)"
    :srl="Number(route.params.article)"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../../../components/header/page.vue'
import Post from '../../../components/pages/article/post/index.vue'

const route = useRoute()
const router = useRouter()
const toast = inject('toast')
const $post = ref()

function onSubmit()
{
  toast.add('아티클을 수정했습니다.', 'success').then()
  router.push(`../`).then()
}
</script>
