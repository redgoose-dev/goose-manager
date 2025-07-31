<template>
<article>
  <PageHeader module="app" title="Create App"/>
  <Post
    ref="$post"
    mode="create"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../../components/header/page.vue'
import Post from '../../components/pages/app/post.vue'

const router = useRouter()
const $post = ref()

onMounted(() => {
  nextTick().then(() => {
    if ($post.value.$refs.root['post-code'])
    {
      $post.value.$refs.root['post-code'].focus()
    }
  })
})

function onSubmit()
{
  router.push('../').then()
}
</script>
