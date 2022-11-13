<template>
<article>
  <PageHeader module="categories" title="Edit category" prefix="[JSON]"/>
  <Post
    mode="edit"
    module="json"
    :target-srl="Number(route.params.nestSrl)"
    :srl="Number(route.params.categorySrl)"/>
</article>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../../components/page/header/index.vue'
import Post from '../../../components/pages/categories/post.vue'

const route = useRoute()
</script>
