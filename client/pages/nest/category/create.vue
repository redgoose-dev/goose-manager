<template>
<article>
  <PageHeader module="category" title="Nest / Create Category"/>
  <Post
    ref="$post"
    mode="create"
    module="nest"
    :module-srl="Number(route.params.nest)"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../../../components/header/page.vue'
import Post from '../../../components/pages/category/post.vue'

const router = useRouter()
const route = useRoute()
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
