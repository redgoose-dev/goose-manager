<template>
<article>
  <PageHeader module="apps" title="Edit App"/>
  <Post mode="edit" :srl="Number($route.params.srl)"/>
</article>
</template>

<script setup>
import PageHeader from '../../components/page/header/index.vue';
import Post from '../../components/pages/apps/post.vue';
</script>
