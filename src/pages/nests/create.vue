<template>
<article>
  <PageHeader module="nests" title="Create nest"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script setup>
import PageHeader from '../../components/page/header/index.vue';
import Post from '../../components/pages/nests/post.vue';
</script>
