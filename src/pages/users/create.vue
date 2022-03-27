<template>
<article>
  <PageHeader module="users" title="Create user"/>
  <Post ref="$post" mode="create"/>
</article>
</template>

<script setup>
import PageHeader from '../../components/page/header/index.vue';
import Post from '../../components/pages/users/post.vue';
</script>
