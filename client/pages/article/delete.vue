<template>
<Delete :srl="Number(route.params.article)"/>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Delete from '../../components/pages/article/delete.vue'

const route = useRoute()
</script>
