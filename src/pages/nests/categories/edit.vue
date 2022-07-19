<template>
<article>
  <PageHeader module="categories" title="Edit category"/>
  <Post
    mode="edit"
    :nest-srl="Number(route.params.nestSrl)"
    :srl="Number(route.params.categorySrl)"/>
</article>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../../components/page/header/index.vue'
import Post from '../../../components/pages/categories/post.vue'

const route = useRoute()
</script>
