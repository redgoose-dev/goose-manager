<template>
<article>
  <PageHeader module="json" title="Create JSON"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script setup>
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/json/post/index.vue'
</script>
