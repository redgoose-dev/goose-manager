<template>
<article class="dashboard">
  <page-header title="Dashboard" description="welcome to goose manager" class="dashboard__header"/>

  <div class="dashboard__body">
    <!-- articles -->
    <section v-if="computedShow.articles" class="dashboard__section">
      <header>
        <h3>Articles</h3>
        <nav>
          <nuxt-link to="/articles/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="articles && articles.length" :column="4">
        <item-thumbnail
          v-for="(item,key) in articles"
          :key="key"
          :image="(item.json && item.json.thumbnail) ? getImageUrl(item.json.thumbnail.path) : null"
          :link="`/articles/${item.srl}/`"
          :title="item.title"
          :alt="item.title"
          :metas="[
            getArticleType(item.type),
            getDate(item.regdate),
            item.category_name,
            `Hit: ${item.hit}`,
            `Like: ${item.star}`
          ]"
          :navs="[
            { label: 'Edit', link: `/articles/${item.srl}/edit/` },
            { label: 'Delete', link: `/articles/${item.srl}/delete/` }
          ]"/>
      </index-wrap>
      <error v-else type="empty" :frame="true" size="small" class="dashboard__error"/>
    </section>
    <!-- // articles -->

    <!-- nests -->
    <section v-if="computedShow.nests" class="dashboard__section">
      <header>
        <h3>Nests</h3>
        <nav>
          <nuxt-link to="/nests/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="nests && nests.length" :column="3">
        <item-card
          v-for="(nest,key) in nests" :key="key"
          :link="`/nests/${nest.srl}/articles/`"
          :title="nest.name"
          :alt="nest.description"
          :use-image="false"
          :metas="[
            `srl: ${nest.srl}`,
            `id: ${nest.id}`,
            getDate(nest.regdate),
          ]"
          :navs="[
            { label: 'Edit', link: `/nests/${nest.srl}/edit/` },
            { label: 'Delete', link: `/nests/${nest.srl}/delete/` },
            !!parseInt(nest.json.useCategory) && { label: 'Category', link: `/categories/${nest.srl}/` },
          ]"/>
      </index-wrap>
      <error v-else type="empty" :frame="true" size="small" class="dashboard__error"/>
    </section>
    <!-- // nests -->

    <!-- apps -->
    <section v-if="computedShow.apps" class="dashboard__section">
      <header>
        <h3>Apps</h3>
        <nav>
          <nuxt-link to="/apps/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="apps && apps.length" :column="3">
        <item-card
          v-for="(app,key) in apps" :key="key"
          :title="app.name"
          :alt="app.description"
          :use-image="false"
          :metas="[
            `srl: ${app.srl}`,
            `id: ${app.id}`,
            getDate(app.regdate),
          ]"
          :navs="[
            { label: 'Edit', link: `/apps/${app.srl}/edit/` },
            { label: 'Delete', link: `/apps/${app.srl}/delete/` },
          ]"/>
      </index-wrap>
      <error v-else type="empty" :frame="true" size="small" class="dashboard__error"/>
    </section>
    <!-- // apps -->

    <!-- json -->
    <section v-if="computedShow.json" class="dashboard__section">
      <header>
        <h3>JSON</h3>
        <nav>
          <nuxt-link to="/json/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="json && json.length" :column="2">
        <item-list
          v-for="(item,key) in json" :key="key"
          :link="`/json/${item.srl}/`"
          :title="item.name"
          :description="item.description"
          :alt="item.name"
          :use-image="false"
          :metas="[
           `srl: ${item.srl}`,
            getDate(item.regdate),
          ]"
          :navs="[
            { label: 'Edit', link: `/json/${item.srl}/edit/` },
            { label: 'Delete', link: `/json/${item.srl}/delete/` },
          ]"/>
      </index-wrap>
      <error v-else type="empty" :frame="true" size="small" class="dashboard__error"/>
    </section>
    <!-- // json -->
  </div>
</article>
</template>

<script>
import * as text from '~/libs/text';
import * as dates from '~/libs/dates';
import * as object from '~/libs/object';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'item-list': () => import('~/components/item/list'),
    'item-card': () => import('~/components/item/card'),
    'item-thumbnail': () => import('~/components/item/thumbnail'),
    'error': () => import('~/components/contents/error'),
    'icon': () => import('~/components/icon'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
  },
  async asyncData(context)
  {
    const { preference } = context.store.state;
    const params = {
      articles: {
        field: 'srl,type,title,hit,star,regdate,category_srl,json',
        order: 'srl',
        sort: 'desc',
        size: object.getValue(preference, 'dashboard', 'articles', 'count') || 8,
        visible_type: 'all',
      },
      nests: {
        field: 'srl,id,name,description,regdate,json',
        order: 'srl',
        sort: 'desc',
        size: object.getValue(preference, 'dashboard', 'nests', 'count') || 6,
      },
      apps: {
        field: 'srl,id,name,description,regdate',
        order: 'srl',
        sort: 'desc',
        size: object.getValue(preference, 'dashboard', 'apps', 'count') || 6,
      },
      json: {
        field: 'srl,name,description,regdate',
        order: 'srl',
        sort: 'desc',
        size: object.getValue(preference, 'dashboard', 'json', 'count') || 3,
      },
    };
    try
    {
      const [ articles, nests, apps, json ] = await Promise.all([
        context.$axios.$get(`/articles/${text.serialize(params.articles, true)}`),
        context.$axios.$get(`/nests/${text.serialize(params.nests, true)}`),
        context.$axios.$get(`/apps/${text.serialize(params.apps, true)}`),
        context.$axios.$get(`/json/${text.serialize(params.json, true)}`),
      ]);
      return {
        articles: articles.success ? articles.data.index : null,
        nests: nests.success ? nests.data.index : null,
        apps: apps.success ? apps.data.index : null,
        json: json.success ? json.data.index : null,
      };
    }
    catch(e)
    {
      return {
        articles: null,
        nests: null,
        apps: null,
        json: null,
      };
    }
  },
  computed: {
    computedShow()
    {
      const { preference } = this.$store.state;
      return {
        articles: object.getValue(preference, 'dashboard', 'articles', 'show') || false,
        nests: object.getValue(preference, 'dashboard', 'nests', 'show') || false,
        apps: object.getValue(preference, 'dashboard', 'apps', 'show') || false,
        json: object.getValue(preference, 'dashboard', 'json', 'show') || false,
      };
    },

  },
  methods: {
    getDate(date)
    {
      return dates.getFormatDate(date, false);
    },
    getImageUrl(path)
    {
      if (!path) return null;
      return `${this.$store.state.url_api}/${path}`;
    },
    getArticleType(type)
    {
      return text.getArticleType(type);
    },
  }
};
</script>
<style src="./index.scss" lang="scss" scoped/>
