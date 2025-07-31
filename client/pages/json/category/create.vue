<template>
<article>
  <PageHeader module="category" title="JSON / Create Category"/>
  <Post
    ref="$post"
    mode="create"
    module="json"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../../../components/header/page.vue'
import Post from '../../../components/pages/category/post.vue'

const router = useRouter()
const $post = ref()

onMounted(() => {
  nextTick().then(() => {
    if ($post.value?.$refs.$root['post-name'])
    {
      $post.value?.$refs.$root['post-name'].focus()
    }
  })
})

function onSubmit()
{
  router.push('../').then()
}
</script>
