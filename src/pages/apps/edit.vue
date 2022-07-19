<template>
<article>
  <PageHeader module="apps" title="Edit App"/>
  <Post mode="edit" :srl="Number(route.params.srl)"/>
</article>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../components/page/header/index.vue'
import Post from '../../components/pages/apps/post.vue'

const route = useRoute()
</script>
