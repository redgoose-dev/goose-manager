<template>
<article>
  <PageHeader module="articles" title="Article / Change nest"/>
  <ChangeNest :srl="route.params.srl"/>
</article>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PageHeader from '../../components/page/header/index.vue'
import ChangeNest from '../../components/pages/articles/change-nest.vue'

const route = useRoute()
</script>
