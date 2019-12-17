<template>
<article>
  <page-header module="nests"/>

  <error v-if="!!error" :message="error"/>
  <error v-else-if="!(index && index.length)" type="empty"/>
  <div v-else>
    <section v-for="(app,appKey) in index" :key="appKey" class="nests">
      <header>
        <h3>
          <span>{{app.name || 'No an app'}}</span>
          <em>{{app.count}}</em>
        </h3>
        <p v-if="!!app.description">{{app.description}}</p>
      </header>
      <div v-if="app.children && app.children.length" class="rg-index-card">
        <ul>
          <li v-for="(nest,nestKey) in app.children" :key="nestKey">
            <item-card
              :link="`/articles/${nest.srl}/`"
              :title="`${nest.name}(${nest.count_articles})`"
              :alt="nest.description"
              :metas="[getDate(nest.regdate), `id: ${nest.id}`]"
              :use-image="false"
              :navs="[
                { label: 'Edit', link: `/nests/${nest.srl}/edit/` },
                { label: 'Delete', link: `/nests/${nest.srl}/delete/` },
                !!parseInt(nest.json.useCategory) && { label: 'Category', link: `/categories/${nest.srl}/` },
              ]"/>
          </li>
        </ul>
      </div>
    </section>
  </div>

  <nav-bottom>
    <template slot="left">
      <button-basic label="Apps" to="/apps/"/>
    </template>
    <template slot="right">
      <button-basic
        v-if="!error && (index && index.length)"
        label="Add Nest"
        to="/nests/add/"
        color="key"/>
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
    getDate: function(date)
    {
      return dates.getFormatDate(date, false);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables";
.nests {
  margin: 40px 0 0;
  &:first-child {
    margin-top: 0;
  }
  > header {
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
      font-size: .625rem;
      color: $color-blur;
      word-break:keep-all;
      overflow-wrap:break-word;
    }
  }
  [class^='rg-index'] {
    margin-top: 12px;
  }
  .rg-index-error {
    margin-top: 12px;
  }
}
</style>
