<template>
<article>
  <PageHeader module="json" title="Edit JSON"/>
  <Post ref="$post" mode="edit" :srl="Number(route.params.srl)"/>
</article>
</template>

<script setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/json/post/index.vue'

const route = useRoute()
</script>
