<template>
<article>
  <PageHeader module="apps" title="Create App"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, DefineComponent } from 'vue'
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/apps/post.vue'

const $post = ref<any>()

onMounted(() => {
  nextTick().then(() => ($post.value as DefineComponent).$refs.root.id.focus())
})
</script>
