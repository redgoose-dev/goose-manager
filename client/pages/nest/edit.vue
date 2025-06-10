<template>
<article>
  <PageHeader module="nest" title="Edit nest"/>
  <Post mode="edit" :srl="Number(route.params.srl)"/>
</article>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../components/header/page.vue'
import Post from '../../components/pages/nest/post.vue'

const route = useRoute()
</script>
