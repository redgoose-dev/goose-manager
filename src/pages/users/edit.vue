<template>
<article>
  <PageHeader module="users" title="Edit user"/>
  <Post mode="edit" :srl="Number(route.params.srl)"/>
</article>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/users/post.vue'

const route = useRoute()
</script>
