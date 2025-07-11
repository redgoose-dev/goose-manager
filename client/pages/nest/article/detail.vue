<template>
<Detail
  :nest-srl="Number(route.params.nest)"
  :srl="Number(route.params.article)"/>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Detail from '../../../components/pages/article/detail.vue'

const route = useRoute()
</script>
