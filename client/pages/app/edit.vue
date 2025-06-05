<template>
<article>
  <PageHeader module="app" title="Edit App"/>
  <Post mode="edit" :srl="Number(route.params.srl)"/>
</article>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../components/header/page.vue'
import Post from '../../components/pages/app/post.vue'

const route = useRoute()
</script>

<style lang="scss" scoped></style>
