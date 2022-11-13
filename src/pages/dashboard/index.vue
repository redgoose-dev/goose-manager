<template>
<article class="dashboard">
  <PageHeader
    :title="preference.dashboard.title"
    :description="preference.dashboard.description"/>
  <Loading v-if="loading"/>
  <div v-else class="dashboard__body">
    <template v-for="content in contents">
      <section v-if="content.module === 'articles'" class="dashboard__section">
        <header>
          <h1>Articles</h1>
          <nav>
            <router-link to="/articles/">
              <Icon name="chevron-right"/>
            </router-link>
          </nav>
        </header>
        <Items v-if="content.index?.length > 0" theme="thumbnail" class="items-image">
          <Thumbnail
            v-for="item in content.index"
            :href="item.href"
            :title="item.title"
            :image="item.image"
            :alt="item.title"
            :meta="item.meta"
            :nav="[
              { label: message.word.edit, href: `/articles/${item.srl}/edit/` },
              { label: message.word.delete, href: `/articles/${item.srl}/delete/` },
            ]"/>
        </Items>
        <Empty v-else title="no item"/>
      </section>
      <section v-if="content.module === 'nests'" class="dashboard__section">
        <header>
          <h1>Nests</h1>
          <nav>
            <router-link to="/nests/">
              <Icon name="chevron-right"/>
            </router-link>
          </nav>
        </header>
        <Items v-if="content.index?.length > 0" theme="card" class="items-card">
          <Card
            v-for="item in content.index"
            :href="item.href"
            :title="item.title"
            :meta="item.meta"
            :nav="[
              item.useCategory && { label: 'Category', href: `/nests/${item.srl}/categories/` },
              { label: message.word.edit, href: `/nests/${item.srl}/edit/` },
              { label: message.word.delete, href: `/nests/${item.srl}/delete/` },
            ].filter(Boolean)"/>
        </Items>
        <Empty v-else title="no item"/>
      </section>
      <section v-if="content.module === 'apps'" class="dashboard__section">
        <header>
          <h1>Apps</h1>
          <nav>
            <router-link to="/apps/">
              <Icon name="chevron-right"/>
            </router-link>
          </nav>
        </header>
        <Items v-if="content.index?.length > 0" theme="card" class="items-card">
          <Card
            v-for="item in content.index"
            :title="item.title"
            :meta="item.meta"
            :nav="[
              { label: message.word.edit, href: `/apps/${item.srl}/edit/` },
              { label: message.word.delete, href: `/apps/${item.srl}/delete/` },
            ]"/>
        </Items>
        <Empty v-else title="no item"/>
      </section>
      <section v-if="content.module === 'json'" class="dashboard__section">
        <header>
          <h1>JSON</h1>
          <nav>
            <router-link to="/json/">
              <Icon name="chevron-right"/>
            </router-link>
          </nav>
        </header>
        <Items v-if="content.index?.length > 0" theme="card" class="items-card">
          <Card
            v-for="item in content.index"
            :href="item.href"
            :title="item.title"
            :meta="item.meta"
            :nav="[
              { label: message.word.edit, href: `/json/${item.srl}/edit/` },
              { label: message.word.delete, href: `/json/${item.srl}/delete/` },
            ]"/>
        </Items>
        <Empty v-else title="no item"/>
      </section>
    </template>
  </div>
</article>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { preferenceStore } from '../../store/preference'
import { err } from '../../libs/error'
import { getData } from '../../structure/dashboard'
import { message } from '../../message'
import { Items, Card, Thumbnail } from '../../components/item'
import PageHeader from '../../components/page/header/index.vue'
import Loading from '../../components/etc/loading.vue'
import Empty from '../../components/pages/dashboard/empty.vue'
import Icon from '../../components/icons/index.vue'

const preference = preferenceStore()
const loading = ref<boolean>(true)
const contents = reactive<any>([])

onMounted(async () => {
  try
  {
    const res = await getData(preference.dashboard.contents)
    res.forEach(o => contents.push(o))
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/dashboard/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
