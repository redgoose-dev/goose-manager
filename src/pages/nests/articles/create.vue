<template>
<article>
  <PageHeader module="articles" title="Create article"/>
  <Post
    ref="$post"
    mode="create"
    :nest-srl="Number(route.params.nestSrl)"/>
</article>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../../components/page/header/index.vue'
import Post from '../../../components/pages/articles/post/index.vue'

const route = useRoute()
</script>
