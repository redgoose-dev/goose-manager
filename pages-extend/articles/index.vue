<template>
<article>
  <page-header module="articles"/>
  <div class="rg-row rg-row-v-center index-header">
    <div class="rg-col"/>
    <div class="index-filter">
      <index-filter
        v-if="!processing"
        :init="{keyword: filter.keyword}"
        :processing="processing"
        @change="onChangeFilter"
        @change-keyword="onChangeKeyword"/>
    </div>
  </div>
  <error v-if="!!error" :message="error" size="large"/>
  <template v-else>
    <index-articles
      :articles="articles"
      :loading="processing"
      :column="5"
      skin="brick"/>
    <paginate
      v-if="!!total"
      type="nuxt-link"
      v-model="page"
      url="./"
      :total="total"
      :size="size"
      :params="filter.keyword ? {q: filter.keyword} : null"
      :page-range="pageRange"
      :show-direction="false"
      :show-range-direction="true"
      :show-end-direction="true"
      @change="page = $event"/>
  </template>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as object from '~/libs/object';

const defaultParams = {
  field: 'srl,title,hit,star,regdate,modate,category_srl,json,`order`',
  ext_field: 'category_name',
  sort: 'desc',
  visible_type: 'all',
};

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'index-articles': () => import('~/components/pages/articles/index-articles'),
    'index-filter': () => import('~/components/pages/articles/index-filter'),
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
        ...defaultParams,
        size: result.size,
        order: result.filter.order,
        sort: result.filter.sort,
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
  watch: {
    '$route': async function()
    {
      this.update().then();
    },
  },
  methods: {
    async update()
    {
      this.page = parseInt(this.$route.query.page) || 1;
      this.filter.keyword = this.$route.query.q || '';
      this.processing = true;
      try
      {
        // get articles
        let params = {
          ...defaultParams,
          size: this.size,
          order: this.filter.order,
          sort: this.filter.sort,
          page: this.page,
        };
        if (this.filter.keyword) params.q = this.filter.keyword;
        const articles = await this.$axios.$get(`/articles/${text.serialize(params, true)}`);
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
      this.filter.order = filter.order;
      this.filter.sort = filter.sort;
      // update preference
      let params = [{ key: 'articles.filter', value: filter }];
      this.$store.dispatch('updatePreference', params).then();
      // update articles data
      this.update().then();
    },
    onChangeKeyword(keyword)
    {
      if (keyword.length < 2 && keyword.length > 0) return;
      let params = {};
      if (keyword) params.q = keyword;
      this.$router.push(`./${text.serialize(params, true)}`);
    },
  },
}
</script>

<style lang="scss" scoped>
.index-header {
  position: sticky;
  top: 0;
  padding: 12px 5px;
  z-index: 2;
  background-color: var(--color-bg);
  margin: -16px -5px 0;
  box-sizing: border-box;
}
.index-filter {
  padding-left: 24px;
}
</style>
