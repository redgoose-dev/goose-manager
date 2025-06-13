<template>
<article>
  <PageHeader module="category" title="Nest / Category"/>
  <CategoryIndex
    module="nest"
    :module-srl="Number(route.params.nest)"/>
  <Controller>
    <template #left>
      <ButtonGroup>
        <ButtonBasic href="../../" icon-left="cloud">
          둥지
        </ButtonBasic>
        <ButtonBasic href="../article/" icon-left="droplet">
          아티클
        </ButtonBasic>
      </ButtonGroup>
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
import { ButtonGroup, ButtonBasic } from '../../../components/button/index.js'

const router = useRouter()
const route = useRoute()
</script>
