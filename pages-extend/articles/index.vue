<template>
<article class="articles">
  <page-header module="articles"/>
  <div class="articles__wrap">
    <div class="articles__side">
      <aside>
        <ul class="articles__metas">
          <li>
            <strong>Total</strong>
            <em>{{computedTotal}}</em>
          </li>
        </ul>
        <index-filter
          v-if="!processing"
          :init="{keyword: filter.keyword}"
          :processing="processing"
          class="articles__filter"
          @change="onChangeFilter"
          @change-keyword="onChangeKeyword"/>
      </aside>
    </div>
    <div :class="['articles__content', filter.skin]">
      <template v-if="!error">
        <index-articles
          :articles="articles"
          :loading="processing"
          :skin="filter.skin"
          :funcGetQuery="setQueryDataInArticles"/>
        <paginate
          v-if="!!total"
          type="nuxt-link"
          v-model="page"
          url="./"
          :total="total"
          :size="size"
          :params="filter.keyword ? { q: filter.keyword } : null"
          :page-range="pageRange"
          :show-direction="false"
          :show-range-direction="true"
          :show-end-direction="true"
          @change="page = $event"/>
      </template>
      <error v-else :message="error" size="large"/>
    </div>
  </div>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as object from '~/libs/object';
import * as number from '~/libs/number';
import * as src from '~/components/pages/articles/src';

export default {
  name: 'page-articles',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'index-articles': () => import('~/components/pages/articles/index/index-articles'),
    'index-filter': () => import('~/components/pages/articles/index/filter'),
    'paginate': () => import('~/components/etc/paginate'),
    'error': () => import('~/components/contents/error'),
    'loading': () => import('~/components/etc/loading'),
  },
  async asyncData(context)
  {
    const { query, store } = context;
    const { preference } = store.state;
    let result = {
      page: parseInt(query.page || 1),
      size: object.getValue(preference, 'articles', 'pageCount') || 20,
      filter: {
        order: preference.articles.filter.order,
        sort: preference.articles.filter.sort,
        type: preference.articles.filter.type,
        skin: preference.articles.filter.skin,
        keyword: query.q || '',
      },
      processing: false,
      error: null,
      pageRange: object.getValue(preference, 'articles', 'pageRange') || 10,
    };

    try
    {
      // set params
      let params = {
        ...src.defaultParamsArticle,
        size: result.size,
        order: src.setOrder(result.filter.order, result.filter.sort),
        visible_type: result.filter.type,
      };
      if (result.page > 1) params.page = result.page;
      if (result.filter.keyword) params.q = result.filter.keyword;

      // get articles
      const articles = await context.$axios.$get(`/articles/${text.serialize(params, true)}`);
      if (!articles.success) throw articles.message;

      result.total = articles.success ? articles.data.total : 0;
      result.articles = articles.success ? articles.data.index : [];
    }
    catch(e)
    {
      result.error = (typeof e === 'string') ? e : messages.error.service;
    }

    return result;
  },
  computed: {
    computedTotal()
    {
      return number.withCommas(this.total);
    },
  },
  watch: {
    '$route': async function()
    {
      this.updateArticles().then();
    },
  },
  methods: {
    async updateArticles()
    {
      const { $route, $axios } = this;
      this.page = parseInt($route.query.page) || 1;
      this.filter.keyword = $route.query.q || '';
      this.processing = true;
      try
      {
        // get articles
        let params = {
          ...src.defaultParamsArticle,
          size: this.size,
          page: this.page,
          order: src.setOrder(this.filter.order, this.filter.sort),
          visible_type: this.filter.type,
        };
        if (this.filter.keyword) params.q = this.filter.keyword;
        const articles = await $axios.$get(`/articles/${text.serialize(params, true)}`);
        if (!articles.success) throw articles.message;
        // update data
        this.total = articles.data.total;
        this.articles = articles.data.index;
        this.error = null;
      }
      catch(e)
      {
        this.error = (typeof e === 'string') ? e : messages.error.service;
      }
      this.processing = false;
    },
    async onChangeFilter(filter)
    {
      let updateArticles = false;
      // checking get items
      if (this.filter.skin === filter.skin) updateArticles = true;
      // update data in component
      this.filter.type = filter.type;
      this.filter.order = filter.order;
      this.filter.sort = filter.sort;
      this.filter.skin = filter.skin;
      // update preference
      let params = [{ key: 'articles.filter', value: filter }];
      this.$store.dispatch('updatePreference', params).then();
      // get items
      if (updateArticles) this.updateArticles().then();
    },
    onChangeKeyword(keyword)
    {
      if (keyword.length < 2 && keyword.length > 0) return;
      let params = {};
      if (keyword) params.q = keyword;
      this.$router.push(`./${text.serialize(params, true)}`);
    },
    setQueryDataInArticles(item)
    {
      let query = {};
      if (this.page && this.page > 1) query.page = this.page;
      return text.serialize(query, true);
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
