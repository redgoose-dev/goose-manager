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
      <index-wrap v-if="app.children && app.children.length" :column="3" type="grid" class="nests__index">
        <item-card
          v-for="(nest,key) in app.children" :key="key"
          :link="`/nests/${nest.srl}/articles/`"
          :title="`${nest.name}(${nest.count_articles})`"
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
      <button-basic v-if="!error && (index && index.length)" to="/nests/add/" color="key" icon-left="plus">
        Add Nest
      </button-basic>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

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
    try
    {
      let res = await cox.$axios.$get('/manager/nests/');
      if (!res.success) throw 'Failed get nests';
      return {
        index: res.data,
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
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";
.nests {
  margin: 40px 0;
  &__header {
    h3 {
      margin: 0;
      font-family: $font-eng;
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1;
      em {
        padding-left: 0;
        font-style: normal;
        &:before {
          content: '(';
        }
        &:after {
          content: ')';
        }
      }
    }
    p {
      margin: 5px 0 0;
      font-size: 11px;
      color: var(--color-blur);
      word-break:keep-all;
      overflow-wrap:break-word;
    }
  }
  &__index {
    margin-top: 15px;
  }
}
</style>
