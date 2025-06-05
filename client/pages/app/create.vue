<template>
<article>
  <PageHeader module="app" title="Create App"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import PageHeader from '../../components/header/page.vue'
import Post from '../../components/pages/app/post.vue'

const $post = ref()

onMounted(() => {
  nextTick().then(() => {
    if ($post.value.$refs.root.code) $post.value.$refs.root.code.focus()
  })
})
</script>
