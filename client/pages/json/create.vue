<template>
<article>
  <PageHeader module="json" title="Create JSON"/>
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
import Post from '../../components/pages/json/post.vue'

const router = useRouter()
const $post = ref()

onMounted(() => {
  nextTick().then(() => {
    if ($post.value.$refs.$root['post-name'])
    {
      $post.value.$refs.$root['post-name'].focus()
    }
  })
})

function onSubmit(srl)
{
  router.push(`../${srl}/`).then()
}
</script>
