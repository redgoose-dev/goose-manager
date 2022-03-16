<template>
<article class="dashboard">
  <PageHeader
    :title="store.state.preference.dashboard.title"
    :description="store.state.preference.dashboard.description"/>
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
              { label: 'Edit', href: `/articles/${item.srl}/edit/` },
              { label: 'Delete', href: `/articles/${item.srl}/delete/` },
            ]"/>
        </Items>
<!--        <Empty/>-->
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
              { label: 'Edit', href: `/nests/${item.srl}/edit/` },
              { label: 'Delete', href: `/nests/${item.srl}/delete/` },
            ].filter(Boolean)"/>
        </Items>
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
              { label: 'Edit', href: `/apps/${item.srl}/edit/` },
              { label: 'Delete', href: `/apps/${item.srl}/delete/` },
            ]"/>
        </Items>
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
              { label: 'Edit', href: `/json/${item.srl}/edit/` },
              { label: 'Delete', href: `/json/${item.srl}/delete/` },
            ]"/>
        </Items>
      </section>
    </template>
  </div>
</article>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import store from '../../store';
import { err } from '../../libs/error';
import { getData } from '../../structure/dashboard';
import { Items, Card, Thumbnail } from '../../components/item';
import PageHeader from '../../components/page/header/index.vue';
import Loading from '../../components/etc/loading.vue';
import Empty from '../../components/error/empty.vue';
import Icon from '../../components/icons/index.vue';

const loading = ref(true);
const contents = reactive([]);

onMounted(async () => {
  try
  {
    const res = await getData(store.state.preference.dashboard.contents);
    res.forEach(item => contents.push(item));
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'dashboard', 'index.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
