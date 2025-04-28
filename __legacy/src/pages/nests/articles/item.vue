<template>
<Item
  :srl="Number(route.params.articleSrl)"
  :nest-srl="Number(route.params.nestSrl)"/>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Item from '../../../components/pages/articles/item/index.vue'

const route = useRoute()
</script>
