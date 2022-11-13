<template>
<article>
  <PageHeader module="categories" title="Create category" prefix="[Article]"/>
  <Post
    mode="create"
    module="article"
    :nest-srl="Number(route.params.nestSrl)"/>
</article>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../../components/page/header/index.vue'
import Post from '../../../components/pages/categories/post.vue'

const route = useRoute()
</script>
