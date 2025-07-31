<template>
<article>
  <PageHeader module="nest" title="Edit Nest"/>
  <Post
    mode="edit"
    :srl="Number(route.params.srl)"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../../components/header/page.vue'
import Post from '../../components/pages/nest/post.vue'

const router = useRouter()
const route = useRoute()

function onSubmit()
{
  router.push('../../').then()
}
</script>
