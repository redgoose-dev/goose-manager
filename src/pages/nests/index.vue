<template>
<article>
  <PageHeader module="nests"/>
  <Loading v-if="processing"/>
  <div v-else-if="index?.length > 0" class="apps">
    <section v-for="app in index" class="app">
      <header class="app__header">
        <h1 class="app__title">
          <em v-if="!!app.id">{{app.id}}</em>
          <strong>{{app.name}}</strong>
          <em v-if="!!app.countNests">{{app.countNests}}</em>
        </h1>
        <p class="app__description">{{app.description}}</p>
      </header>
      <Items v-if="app.nests?.length > 0" theme="card" class="app__nests">
        <Card
          v-for="nest in app.nests"
          :href="`./${nest.srl}/articles/`"
          :title="nest.title"
          :description="nest.description"
          :meta="nest.meta"
          :nav="[
            { label: '수정', href: `./${nest.srl}/edit/` },
            { label: '삭제', href: `./${nest.srl}/delete/` },
            nest.useCategory && {
              label: '분류',
              href: `./${nest.srl}/categories/`,
            },
          ].filter(Boolean)"
          class="nest"/>
      </Items>
      <div v-else class="nests-empty">
        <strong>no item</strong>
      </div>
    </section>
  </div>
  <Empty v-else title="no item"/>
  <Controller>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        둥지 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { err } from '../../libs/error'
import getData, { SectionItem } from '../../structure/nests'
import PageHeader from '../../components/page/header/index.vue'
import { Items, Card } from '../../components/item'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/error/empty.vue'

const processing = ref<boolean>(false)
const index = ref<SectionItem[]>()

onMounted(async () => {
  try
  {
    processing.value = true
    index.value = await getData()
    processing.value = false
  }
  catch (e: any)
  {
    err(['/pages/nests/index.vue', 'onMounted()'], 'error', e.message)
    processing.value = false
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
