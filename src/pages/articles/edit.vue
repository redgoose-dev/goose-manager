<template>
<article>
  <PageHeader module="articles" title="Edit article"/>
  <Post
    ref="$post"
    mode="edit"
    :article-srl="Number(route.params.srl)"/>
</article>
</template>

<script setup>
import { useRoute } from 'vue-router';
import PageHeader from '../../components/page/header/index.vue';
import Post from '../../components/pages/articles/post/index.vue';

const route = useRoute();
</script>
