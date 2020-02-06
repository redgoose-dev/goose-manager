<template>
<article>
  <page-header
    module="articles"
    :title="`${nest ? `[${nest.name}] ` : ''}Articles`"
    :description="computedDescription"/>
  <div class="rg-row rg-row-v-center index-header">
    <div class="rg-col">
      <index-categories
        v-if="categories"
        :nest_srl="nest_srl"
        :categories="categories"
        :category_srl="category_srl"
        @change="category_srl = $event"/>
    </div>
    <div class="index-filter">
      <index-filter
        v-if="!processing"
        :init="{keyword: filter.keyword}"
        @change="onChangeFilter"
        @change-keyword="onChangeKeyword"/>
    </div>
  </div>
  <error v-if="!!error" :message="error" size="large"/>
  <template v-else>
    <index-articles
      :articles="articles"
      :skin="skin"
      :loading="processing"/>
    <paginate
      v-if="!!total"
      type="nuxt-link"
      v-model="page"
      url="./"
      :params="computedPaginateParams"
      :total="total"
      :size="size"
      :page-range="pageRange"
      :show-direction="false"
      :show-range-direction="true"
      :show-end-direction="true"
      @change="page = $event"/>
  </template>
  <nav-bottom>
    <template slot="left">
      <button-basic to="../../" icon-left="cloud">Nests</button-basic>
      <button-basic
        v-if="(nest && parseInt(nest.json.useCategory) === 1)"
        :to="`../../${nest_srl}/categories/`"
        icon-left="server">
        Categories
      </button-basic>
    </template>
    <template slot="right">
      <button-basic
        :to="`./add/${category_srl ? `?category=${category_srl}` : ''}`"
        color="key"
        icon-left="plus">
        Add article
      </button-basic>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as object from '~/libs/object';
import * as src from '~/components/pages/articles/src';

export default {
  name: 'page-articles-index',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'index-articles': () => import('~/components/pages/articles/index/index-articles'),
    'index-categories': () => import('~/components/pages/articles/index/index-categories'),
    'paginate': () => import('~/components/etc/paginate'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'index-filter': () => import('~/components/pages/articles/index/filter'),
  },
  validate(cox)
  {
    return cox.params.nest && /^\d+$/.test(cox.params.nest);
  },
  async asyncData(context)
  {
    const { query, store, params } = context;
    const { preference } = store.state;
    let result = {
      nest_srl: parseInt(params.nest) || null,
      category_srl: query.category || null,
      page: parseInt(query.page || 1),
      size: object.getValue(preference, 'articles', 'pageCount') || 20,
      error: null,
      processing: false,
      pageRange: object.getValue(preference, 'articles', 'pageRange') || 10,
      filter: {
        order: preference.articles.filter.order,
        sort: preference.articles.filter.sort,
        keyword: query.q || '',
      },
    };

    // set params for articles
    let paramsArticle = {
      ...src.defaultParamsArticle,
      nest: result.nest_srl,
      size: result.size,
      order: src.setOrder(result.filter.order, result.filter.sort),
    };
    if (result.page > 1) paramsArticle.page = result.page;
    if (result.category_srl) paramsArticle.category = result.category_srl;
    if (result.filter.keyword) paramsArticle.q = result.filter.keyword;

    // set params for category
    let paramsCategory = Object.assign({}, src.defaultParamsCategory);
    paramsCategory.nest = result.nest_srl;

    try
    {
      const [ categories, articles, nest ] = await Promise.all([
        context.$axios.$get(`/categories/${text.serialize(paramsCategory, true)}`),
        context.$axios.$get(`/articles/${text.serialize(paramsArticle, true)}`),
        context.$axios.$get(`/nests/${result.nest_srl}/?field=name,json,description`)
      ]);
      result.total = articles.success ? articles.data.total : 0;
      result.nest = nest.success ? nest.data : null;
      result.articles = articles.success ? articles.data.index : null;
      result.categories = categories.success ? categories.data.index : null;
      result.skin = nest.success && nest.data.json.articleSkin ? nest.data.json.articleSkin : null;
    }
    catch(e)
    {
      result.error = (typeof e === 'string') ? e : messages.error.service;
    }

    return result;
  },
  computed: {
    computedDescription()
    {
      return object.getValue(this.nest, 'description') || null;
    },
    computedPaginateParams()
    {
      let result = {};
      if (this.category_srl) result.category = this.category_srl;
      if (this.filter.keyword) result.q = this.filter.keyword;
      return result;
    },
  },
  watch: {
    '$route': function()
    {
      this.update().then();
    },
  },
  methods: {
    async update()
    {
      this.page = parseInt(this.$route.query.page) || 1;
      this.category_srl = this.$route.query.category || null;
      this.filter.keyword = this.$route.query.q || '';
      this.processing = true;
      // get articles
      try
      {
        let params = {
          ...src.defaultParamsArticle,
          nest: this.nest_srl,
          size: this.size,
          page: this.page,
          order: src.setOrder(this.filter.order, this.filter.sort),
        };
        if (this.category_srl) params.category = this.category_srl;
        if (this.filter.keyword) params.q = this.filter.keyword;
        const res = await this.$axios.$get(`/articles/${text.serialize(params, true)}`);
        this.total = (res.success && res.data) ? res.data.total : 0;
        this.articles = (res.success && res.data) ? res.data.index : null;
        this.error = null;
      }
      catch(e)
      {
        this.error = (typeof e === 'string') ? e : messages.error.service;
      }
      this.processing = false;
    },
    onChangeFilter(filter)
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
  position: relative;
  padding: 12px 5px;
  z-index: 2;
  background-color: var(--color-bg);
  margin: -16px -5px 0;
  box-sizing: border-box;
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: var(--color-bg);
    width: 20px;
  }
  &:before {
    left: -20px;
  }
  &:after {
    right: -20px;
  }
}
.index-filter {
  padding-left: 24px;
}
</style>
