<template>
<article>
  <PageHeader module="nests" title="Edit nest"/>
  <Post ref="$post" mode="edit" :srl="Number($route.params.srl)"/>
</article>
</template>

<script setup>
import PageHeader from '../../components/page/header/index.vue';
import Post from '../../components/pages/nests/post.vue';
</script>
