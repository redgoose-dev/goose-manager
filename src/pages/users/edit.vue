<template>
<article>
  <PageHeader module="users" title="Edit User"/>
  <Post mode="edit" :srl="Number($route.params.srl)"/>
</article>
</template>

<script setup>
import PageHeader from '../../components/page/header/index.vue';
import Post from '../../components/pages/users/post.vue';
</script>
