<template>
<article>
  <PageHeader module="nests" title="Edit nest"/>
  <Post ref="$post" mode="edit" :srl="Number(route.params.srl)"/>
</article>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/nests/post.vue'

const route = useRoute()
</script>
