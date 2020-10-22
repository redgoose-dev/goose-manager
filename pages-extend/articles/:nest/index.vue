<template>
<article class="articles">
  <page-header
    module="articles"
    :title="`${nest ? `[${nest.name}] ` : ''}Articles`"
    :description="computedDescription"/>
  <index-categories
    v-if="categories"
    :nest_srl="nest_srl"
    :categories="categories"
    :category_srl="category_srl"
    class="categories"
    @change="category_srl = $event"/>
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
          :params="computedPaginateParams"
          :total="total"
          :size="size"
          :page-range="pageRange"
          :show-direction="false"
          :show-range-direction="true"
          :show-end-direction="true"
          @change="page = $event"/>
      </template>
      <error v-else :message="error" size="large"/>
      <nav-bottom>
        <template slot="left">
          <button-basic href="../../" icon-left="cloud">Nests</button-basic>
          <button-basic
            v-if="(nest && parseInt(nest.json.useCategory) === 1)"
            :href="`../../${nest_srl}/categories/`"
            icon-left="server">
            Categories
          </button-basic>
        </template>
        <template slot="right">
          <button-basic
            :href="`./add/${category_srl ? `?category=${category_srl}` : ''}`"
            color="key"
            icon-left="plus">
            Add article
          </button-basic>
        </template>
      </nav-bottom>
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
        type: preference.articles.filter.type,
        skin: preference.articles.filter.skin,
        keyword: query.q || '',
      },
    };

    // set params for articles
    let paramsArticle = {
      ...src.defaultParamsArticle,
      nest: result.nest_srl,
      size: result.size,
      order: src.setOrder(result.filter.order, result.filter.sort),
      visible_type: result.filter.type,
    };
    if (result.page > 1) paramsArticle.page = result.page;
    if (result.category_srl) paramsArticle.category = result.category_srl;
    if (result.filter.keyword) paramsArticle.q = result.filter.keyword;

    // set params for category
    let paramsCategory = Object.assign({}, src.defaultParamsCategory);
    paramsCategory.nest = result.nest_srl;
    paramsCategory.visible_type = result.filter.type;
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
    computedTotal()
    {
      const { categories } = this;
      let total = 0;
      if (categories && categories[0] && !categories[0].srl)
      {
        total = this.categories[0].count_article;
      }
      else
      {
        total = this.total;
      }
      return number.withCommas(total);
    },
  },
  watch: {
    '$route': function()
    {
      this.updateArticles().then();
    },
  },
  methods: {
    async updateArticles()
    {
      const { $route, $axios } = this;
      this.page = parseInt($route.query.page) || 1;
      this.category_srl = $route.query.category || null;
      this.filter.keyword = $route.query.q || '';
      this.processing = true;
      try
      {
        let paramsArticles = {
          ...src.defaultParamsArticle,
          nest: this.nest_srl,
          size: this.size,
          page: this.page,
          order: src.setOrder(this.filter.order, this.filter.sort),
          visible_type: this.filter.type,
        };
        if (this.category_srl) paramsArticles.category = this.category_srl;
        if (this.filter.keyword) paramsArticles.q = this.filter.keyword;
        const articles = await $axios.$get(`/articles/${text.serialize(paramsArticles, true)}`);
        this.total = (articles.success && articles.data) ? articles.data.total : 0;
        this.articles = (articles.success && articles.data) ? articles.data.index : null;
        this.error = null;
      }
      catch(e)
      {
        this.error = (typeof e === 'string') ? e : messages.error.service;
      }
      this.processing = false;
    },
    async updateCategories()
    {
      const { $axios } = this;
      let paramsCategory = Object.assign({}, src.defaultParamsCategory);
      paramsCategory.nest = this.nest_srl;
      paramsCategory.visible_type = this.filter.type;
      const categories = await $axios.$get(`/categories/${text.serialize(paramsCategory, true)}`);
      this.categories = categories.success ? categories.data.index : null;
    },
    async onChangeFilter(filter)
    {
      let updateArticles = false;
      let updateCategories = false;
      // checking get items
      if (this.categories && this.filter.type !== filter.type) updateCategories = true;
      if (this.filter.skin === filter.skin) updateArticles = true;
      // update data in component
      this.filter.type = filter.type;
      this.filter.order = filter.order;
      this.filter.sort = filter.sort;
      this.filter.skin = filter.skin;
      // update preference
      let params = [{ key: 'articles.filter', value: filter }];
      await this.$store.dispatch('updatePreference', params);
      // get items
      if (updateArticles) this.updateArticles().then();
      if (updateCategories) this.updateCategories().then();
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
      if (this.category_srl) query.category = this.category_srl;
      if (this.page && this.page > 1) query.page = this.page;
      return text.serialize(query, true);
    },
  },
}
</script>

<style src="../index.scss" lang="scss" scoped/>
