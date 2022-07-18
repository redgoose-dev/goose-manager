<template>
<article>
  <PageHeader module="json" title="Create JSON"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script lang="ts" setup>
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/json/post.vue'
</script>
