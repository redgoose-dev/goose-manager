<template>
<article>
  <PageHeader module="json" title="JSON / Category"/>
  <CategoryIndex module="json"/>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="code">
        목록
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./create/" icon-left="plus" color="key">
        분류 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '../../../components/header/page.vue'
import CategoryIndex from '../../../components/pages/category/index.vue'
import { Controller } from '../../../components/navigation/index.js'
import { ButtonBasic } from '../../../components/button/index.js'

const router = useRouter()
const route = useRoute()
</script>
