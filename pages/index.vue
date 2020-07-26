<template>
<article class="dashboard">
  <page-header :title="title" :description="description" class="dashboard__header"/>

  <div class="dashboard__body">
    <!-- articles -->
    <section v-if="contents && contents.articles" class="dashboard__section">
      <header>
        <h3>Articles</h3>
        <nav>
          <nuxt-link to="/articles/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="contents.articles.length" type="grid" class="items--articles">
        <item-thumbnail
          v-for="(item,key) in contents.articles"
          :key="key"
          :image="(item.json && item.json.thumbnail) ? getImageUrl(item.json.thumbnail.path) : null"
          :href="`/articles/${item.srl}/`"
          :title="item.title"
          :alt="item.title"
          :metas="[
            getArticleType(item.type),
            getDate(item, 'articles'),
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
    <section v-if="contents && contents.nests" class="dashboard__section">
      <header>
        <h3>Nests</h3>
        <nav>
          <nuxt-link to="/nests/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="contents.nests.length" type="grid" class="items--nests">
        <item-card
          v-for="(nest,key) in contents.nests" :key="key"
          :href="`/nests/${nest.srl}/articles/`"
          :title="nest.name"
          :alt="nest.description"
          :use-image="false"
          :metas="[
            `srl: ${nest.srl}`,
            `id: ${nest.id}`,
            getDate(nest, 'nests'),
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
    <section v-if="contents && contents.apps" class="dashboard__section">
      <header>
        <h3>Apps</h3>
        <nav>
          <nuxt-link to="/apps/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="contents.apps.length" type="grid" class="items--apps">
        <item-card
          v-for="(app,key) in contents.apps" :key="key"
          :title="app.name"
          :alt="app.description"
          :use-image="false"
          :metas="[
            `srl: ${app.srl}`,
            `id: ${app.id}`,
            getDate(app, 'apps'),
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
    <section v-if="contents && contents.json" class="dashboard__section">
      <header>
        <h3>JSON</h3>
        <nav>
          <nuxt-link to="/json/"><icon name="chevron-right"/></nuxt-link>
        </nav>
      </header>
      <index-wrap v-if="contents.json.length" type="grid" class="items--json">
        <item-list
          v-for="(item,key) in contents.json" :key="key"
          :href="`/json/${item.srl}/`"
          :title="item.name"
          :description="item.description"
          :alt="item.name"
          :use-image="false"
          :metas="[
           `srl: ${item.srl}`,
            getDate(item, 'json'),
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

const baseParams = {
  articles: {
    field: 'srl,type,title,hit,star,regdate,modate,category_srl,json,`order`',
    order: 'srl',
    sort: 'desc',
    size: 8,
    visible_type: 'all',
  },
  nests: {
    field: 'srl,id,name,description,regdate,json',
    order: 'srl',
    sort: 'desc',
    size: 6,
  },
  apps: {
    field: 'srl,id,name,description,regdate',
    order: 'srl',
    sort: 'desc',
    size: 6,
  },
  json: {
    field: 'srl,name,description,regdate',
    order: 'srl',
    sort: 'desc',
    size: 3,
  },
};

/**
 * with params form get datas
 *
 * @param {object} baseParams
 * @param {object} contents
 * @return {object}
 */
export function withParamsForGetDatas(baseParams, contents)
{
  let result = {};
  Object.keys(contents).filter((o) => contents[o].show).forEach((key) => {
    result[key] = {
      ...(baseParams[key] ? baseParams[key] : null),
      ...(contents[key].count ? { size: contents[key].count } : null),
    };
  });
  return result;
}

export default {
  name: 'page-dashboard',
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
    let result = {};
    const { preference } = context.store.state;

    try
    {
      const { dashboard } = preference;
      // set params
      const params = withParamsForGetDatas(baseParams, dashboard.contents);

      // result set in preference
      result.title = dashboard.title || 'Dashboard';
      result.description = dashboard.description || null;

      // get datas
      const [ articles, nests, apps, json ] = await Promise.all([
        !!params.articles && context.$axios.$get(`/articles/${text.serialize(params.articles, true)}`),
        !!params.nests && context.$axios.$get(`/nests/${text.serialize(params.nests, true)}`),
        !!params.apps && context.$axios.$get(`/apps/${text.serialize(params.apps, true)}`),
        !!params.json && context.$axios.$get(`/json/${text.serialize(params.json, true)}`),
      ]);

      return {
        ...result,
        contents: {
          articles: !!articles ? (articles.success ? articles.data.index : []) : null,
          nests: !!nests ? (nests.success ? nests.data.index : []) : null,
          apps: !!apps ? (apps.success ? apps.data.index : []) : null,
          json: !!json ? (json.success ? json.data.index : []) : null,
        },
      };
    }
    catch(e)
    {
      return {
        ...result,
        contents: null,
      };
    }
  },
  methods: {
    getDate(item, type)
    {
      function convertDate(item, field)
      {
        switch (field)
        {
          case 'order':
            return dates.getFormatDate(item.order, false);
          case 'regdate':
          default:
            return dates.getFormatDate(item.regdate, false);
        }
      }

      const { preference } = this.$store.state;
      switch (type)
      {
        case 'articles':
          return convertDate(item, preference.articles.displayDateField);
        default:
          return convertDate(item);
      }
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
  },
};
</script>

<style src="./index.scss" lang="scss" scoped/>
