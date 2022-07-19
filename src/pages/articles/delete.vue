<template>
<Delete :srl="Number(route.params.srl)"/>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import Delete from '../../components/pages/articles/delete.vue'

const route = useRoute()
</script>
