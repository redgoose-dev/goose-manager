<template>
<article>
  <PageHeader module="nest"/>
  <div class="container">
    <Loading v-if="state.loading"/>
    <div v-else-if="state.apps.length > 0" class="apps">
      <section v-for="app in state.apps" class="app">
        <header class="app__header">
          <h1>
            <em>{{app.code}}</em>
            <strong>{{app.name}}</strong>
            <em>{{app.countNest}}</em>
          </h1>
          <p>{{app.description}}</p>
        </header>
        <Items
          v-if="app.nests?.length > 0"
          theme="card"
          class="app__nests">
          <Card
            v-for="nest in app.nests"
            :href="`./${nest.srl}/article/`"
            :title="nest.title"
            :description="nest.description"
            :meta="nest.meta"
            :nav="[
              { label: '수정', href: `./${nest.srl}/edit/` },
              nest.useCategory && { label: '분류', href: `./${nest.srl}/category/` },
              { label: '삭제', href: `./${nest.srl}/delete/` },
            ].filter(Boolean)"
            :status="nest.status"/>
        </Items>
        <Empty
          v-else
          tag="div"
          :icon="iconRandomPick()"
          class="app__empty"/>
      </section>
    </div>
    <Empty v-else title="No data"/>
  </div>
  <Controller>
    <template #right>
      <ButtonBasic
        href="./create/"
        color="key"
        icon-left="plus">
        둥지 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { getData } from '../../structure/nest/index.js'
import { iconRandomPick } from '../../components/icon/map.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty } from '../../components/content/index.js'
import { Items, Card } from '../../components/item/index.js'
import { Controller } from '../../components/navigation/index.js'
import { ButtonBasic } from '../../components/button/index.js'

const error = inject('error')
const state = reactive({
  loading: true,
  apps: [],
})
const errorPath = [ 'pages', 'nest', 'index.vue' ]

onMounted(async () => {
  try
  {
    state.apps = await getData()
  }
  catch (_e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '앱과 둥지 데이터를 가져오지 못했습니다.',
      error: _e,
    })
  }
  finally
  {
    state.loading = false
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
