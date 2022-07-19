<template>
<Delete :srl="Number(route.params.articleSrl)"/>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import Delete from '../../../components/pages/articles/delete.vue'

const route = useRoute()
</script>
