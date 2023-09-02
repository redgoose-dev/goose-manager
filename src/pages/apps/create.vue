<template>
<article>
  <PageHeader module="apps" title="Create App"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/apps/post.vue'

const $post = ref()

onMounted(() => {
  nextTick().then(() => $post.value.$refs.root.id.focus())
})
</script>
