<template>
<article>
  <PageHeader module="categories" title="Create category" prefix="[JSON]"/>
  <Post mode="create" module="json"/>
</article>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../../components/page/header/index.vue'
import Post from '../../../components/pages/categories/post.vue'

const route = useRoute()
</script>
