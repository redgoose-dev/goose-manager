<template>
<article>
  <PageHeader module="nest" title="Create nest"/>
  <Post
    mode="create"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PageHeader from '../../components/header/page.vue'
import Post from '../../components/pages/nest/post.vue'

const router = useRouter()

function onSubmit()
{
  router.push('../').then()
}
</script>
