<template>
<article>
  <PageHeader module="json" title="Edit JSON"/>
  <Post
    ref="$post"
    mode="edit"
    :srl="Number(route.params.srl)"
    @submit="onSubmit"/>
</article>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../../components/header/page.vue'
import Post from '../../components/pages/json/post.vue'

const router = useRouter()
const route = useRoute()

function onSubmit()
{
  router.push(`../`).then()
}
</script>

<style lang="scss" scoped></style>
