<template>
<article>
  <page-header module="nests"/>

  <error v-if="!!error" :message="error" size="large"/>
  <error v-else-if="!(index && index.length)" type="empty" size="large"/>
  <template v-else>
    <section v-for="(app,appKey) in index" :key="appKey" class="nests">
      <header class="nests__header">
        <h3>
          <span>{{app.name || 'No an app'}}</span>
          <em>{{app.count}}</em>
        </h3>
        <p v-if="!!app.description">{{app.description}}</p>
      </header>
      <index-wrap v-if="app.children && app.children.length" type="grid" class="nests__index">
        <item-card
          v-for="(nest,key) in app.children" :key="key"
          :link="`/nests/${nest.srl}/articles/`"
          :title="`${nest.name}(${nest.count})`"
          :alt="nest.description"
          :metas="[getDate(nest.regdate), `id: ${nest.id}`]"
          :use-image="false"
          :navs="[
            { label: 'Edit', link: `/nests/${nest.srl}/edit/` },
            { label: 'Delete', link: `/nests/${nest.srl}/delete/` },
            !!parseInt(nest.json.useCategory) && { label: 'Category', link: `/nests/${nest.srl}/categories/` },
          ]"/>
      </index-wrap>
    </section>
  </template>

  <nav-bottom>
    <template slot="left">
      <button-basic to="/apps/" icon-left="package">Apps</button-basic>
    </template>
    <template slot="right">
      <button-basic
        v-if="!error && (index && index.length)"
        to="/nests/add/"
        color="key"
        icon-left="plus">
        Add Nest
      </button-basic>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';
import * as object from '~/libs/object';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'item-card': () => import('~/components/item/card'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
  },
  async asyncData(cox)
  {
    const { store, $axios } = cox;
    let params = {};
    try
    {
      // get apps
      params = { unlimit: 1, ext_field: 'count_nests' };
      if (!store.state.authUser.admin) params.user = store.state.authUser.srl;
      let apps = await $axios.$get(`/apps/${text.serialize(params, true)}`);

      // get nests
      params = { unlimit: 1, ext_field: 'count_articles', visible_type: 'all' };
      if (!store.state.authUser.admin) params.user = store.state.authUser.srl;
      let nests = await $axios.$get(`/nests/${text.serialize(params, true)}`);

      // combine response data
      let index = apps.data ? apps.data.index : [];
      index = index.map((app,key) => {
        let result = {
          ...app,
          count: app.count_nest,
        };
        delete result.count_nest;
        if (nests.data && nests.data.total > 0)
        {
          let children = object.getValues(nests.data.index, 'app_srl', app.srl);
          result.children = children.map((nest,key) => {
            let result = {
              ...nest,
              count: nest.count_article,
            };
            delete result.count_article;
            return result;
          });
        }
        return result;
      });
      return {
        index,
        error: '',
      };
    }
    catch(e)
    {
      return { error: (typeof e === 'string') ? e : messages.error.service };
    }
  },
  methods: {
    getDate(date)
    {
      return dates.getFormatDate(date, false);
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
