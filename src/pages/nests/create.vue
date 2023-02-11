<template>
<article>
  <PageHeader module="nests" title="Create nest"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script lang="ts" setup>
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/nests/post.vue'
</script>
