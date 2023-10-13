<template>
<Item :srl="Number(route.params.srl)"/>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Item from '../../components/pages/articles/item/index.vue'

const route = useRoute()
</script>
