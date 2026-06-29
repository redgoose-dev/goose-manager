<template>
<article class="container-over">
  <PageHeader
    module="dashboard"
    :title="preference.dashboard.title"
    :description="preference.dashboard.description"/>
  <Loading v-if="state.loading"/>
  <div v-else-if="_existContent" class="contents">
    <section
      v-if="state.map.get('article')"
      class="section"
      :style="{ '--order': state.order.indexOf('article') }">
      <header>
        <h1>Article</h1>
        <nav>
          <ButtonIcon href="/article/" icon-name="chevron-right" color="transparent"/>
        </nav>
      </header>
      <div class="items-wrap">
        <Items theme="thumbnail" class="items-image">
          <Thumbnail
            v-for="o in state.map.get('article')"
            :title="o.title"
            :href="o.href"
            :image="o.image"
            :alt="o.title"
            :private="o.private"
            thumbnail-type="cover"
            :meta="o.meta"
            :nav="[
              { label: '수정', href: `/article/${o.srl}/edit/` },
              { label: '삭제', href: `/article/${o.srl}/delete/` },
            ]">
            <template #after>
              <Mark v-if="o.private"/>
            </template>
          </Thumbnail>
        </Items>
      </div>
    </section>
    <section
      v-if="state.map.get('nest')"
      class="section"
      :style="{ '--order': state.order.indexOf('nest') }">
      <header>
        <h1>Nest</h1>
        <nav>
          <ButtonIcon href="/nest/" icon-name="chevron-right" color="transparent"/>
        </nav>
      </header>
      <div class="items-wrap">
        <Items theme="card" class="items-card">
          <Card
            v-for="o in state.map.get('nest')"
            :href="o.href"
            :title="o.title"
            :meta="o.meta"
            :nav="[
              o.useCategory && { label: '분류', href: `/nest/${o.srl}/category/` },
              { label: '수정', href: `/nest/${o.srl}/edit/` },
              { label: '삭제', href: `/nest/${o.srl}/delete/` },
            ].filter(Boolean)"
            :status="o.status"/>
        </Items>
      </div>
    </section>
    <section
      v-if="state.map.get('app')"
      class="section"
      :style="{ '--order': state.order.indexOf('app') }">
      <header>
        <h1>APP</h1>
        <nav>
          <ButtonIcon href="/app/" icon-name="chevron-right" color="transparent"/>
        </nav>
      </header>
      <div class="items-wrap">
        <Items theme="card" class="items-card">
          <Card
            v-for="o in state.map.get('app')"
            :title="o.title"
            :meta="o.meta"
            :nav="[
              { label: '수정', href: `/app/${o.srl}/edit/` },
              { label: '삭제', href: `/app/${o.srl}/delete/` },
            ]"
            :status="o.status"/>
        </Items>
      </div>
    </section>
    <section
      v-if="state.map.get('json')"
      class="section"
      :style="{ '--order': state.order.indexOf('json') }">
      <header>
        <h1>JSON</h1>
        <nav>
          <ButtonIcon href="/json/" icon-name="chevron-right" color="transparent"/>
        </nav>
      </header>
      <div class="items-wrap">
        <Items theme="card" class="items-card">
          <Card
            v-for="o in state.map.get('json')"
            :href="o.href"
            :title="o.title"
            :meta="o.meta"
            :nav="[
              { label: '수정', href: `/json/${o.srl}/edit/` },
              { label: '삭제', href: `/json/${o.srl}/delete/` },
            ]"/>
        </Items>
      </div>
    </section>
  </div>
  <Empty v-else title="no data"/>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, inject } from 'vue'
import { getData } from '@/structure/dashboard/index.js'
import PageHeader from '@/components/header/page.vue'
import { Loading, Empty } from '@/components/content/index.js'
import { ButtonIcon } from '@/components/button/index.js'
import { Items, Mark } from '@/components/item/index.js'
import Thumbnail from '@/components/item/thumbnail.vue'
import Card from '@/components/item/card.vue'

const auth = inject('auth')
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'dashboard.vue' ]
const state = reactive({
  loading: true,
  map: new Map(),
  order: [],
})

const _existContent = computed(() => {
  if (state.map.size <= 0) return false
  for (const key of state.order) if (!!state.map.get(key))
  {
    return true
  }
  return false
})
const _index = computed(() => {
  return state.order.map((key, idx) => {
    if (!state.map.get(key)) return false
    return {
      idx,
      item: state.map.get(key),
    }
  }).filter(Boolean)
})

onMounted(async () => {
  try
  {
    const { map, order } = await getData(preference.dashboard.contents)
    state.map = map
    state.order = order
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '대시보드 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
