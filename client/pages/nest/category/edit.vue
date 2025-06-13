<template>
<article>
  <PageHeader module="category" title="Nest / Edit Category"/>
  <Post
    mode="edit"
    module="nest"
    :module-srl="Number(route.params.nest)"
    :srl="Number(route.params.category)"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../../../components/header/page.vue'
import Post from '../../../components/pages/category/post.vue'

const router = useRouter()
const route = useRoute()

function onSubmit()
{
  router.push('../../').then()
}
</script>
