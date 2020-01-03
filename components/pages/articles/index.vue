<template>
  <article>
    <page-header
      module="articles"
      :title="`${nest ? `[${nest.name}] ` : ''}Articles`"
      :description="computedDescription"/>

    <error v-if="!!error" :message="error"/>
    <template v-else>
      <index-categories
        :nest_srl="nest_srl"
        :categories="categories"
        :category_srl="category_srl"
        @change="category_srl = $event"/>
      <index-articles
        :nest_srl="nest_srl"
        :category_srl="category_srl"
        :page="page"
        :total="total"
        :articles="articles"
        :skin="skin"
        :loading="processing"/>
      <paginate
        v-if="!!total"
        v-model="page"
        url="/articles"
        :total="total"
        :size="size"
        :page-range="10"
        :show-range-direction="true"
        :show-end-direction="true"
        @change="onChangePage"/>
    </template>

    <nav-bottom>
      <template slot="left">
        <button-basic to="/nests/" icon-left="archive">Nests</button-basic>
        <button-basic
          v-if="(nest && parseInt(nest.json.useCategory) === 1)"
          :to="`/categories/${nest_srl}/`"
          icon-left="server">
          Categories
        </button-basic>
      </template>
      <template slot="right">
        <button-basic
          :to="`/articles/${nest_srl}/add/${category_srl ? `?category=${category_srl}` : ''}`"
          color="key">
          Add article
        </button-basic>
      </template>
    </nav-bottom>
  </article>
</template>

<script>
import * as src from './src';
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as object from '~/libs/object';

export default {
  name: 'page-articles-index',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'index-articles': () => import('~/components/pages/articles/index-articles'),
    'index-categories': () => import('~/components/pages/articles/index-categories'),
    'paginate': () => import('~/components/etc/paginate'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  props: {
    getData: { type: Object, required: true },
  },
  data()
  {
    const { getData } = this;
    return {
      nest_srl: getData.nest_srl,
      category_srl: getData.category_srl,
      page: getData.page,
      size: getData.size,
      total: getData.total,
      articles: getData.articles,
      categories: getData.categories,
      nest: getData.nest,
      skin: getData.skin,
      error: null,
      processing: false,
    };
  },
  computed: {
    computedDescription()
    {
      return object.getValue(this.nest, 'description') || null;
    },
  },
  watch: {
    category_srl()
    {
      this.onChangeCategory().then();
    },
  },
  methods: {
    async onChangeCategory()
    {
      try
      {
        // change url
        this.$router.replace(this.setCategoryUrl(this.category_srl));

        // update data
        this.processing = true;
        this.page = 1;

        // get articles
        let paramsArticle = Object.assign({}, src.defaultParamsArticle);
        paramsArticle.nest = this.nest_srl;
        paramsArticle.size = this.size;
        paramsArticle.page = 1;
        if (this.category_srl) paramsArticle.category = this.category_srl;
        const articles = await this.$axios.$get(`/articles/${text.serialize(paramsArticle, true)}`);

        this.total = articles.success ? articles.data.total : 0;
        this.articles = articles.success ? articles.data.index : null;
        this.processing = false;
      }
      catch(e)
      {
        this.processing = false;
        return { error: (typeof e === 'string') ? e : messages.error.service };
      }
    },
    async onChangePage(page)
    {
      try
      {
        // change url
        let params = {};
        if (this.category_srl) params.category = this.category_srl;
        if (page > 1) params.page = page;
        this.$router.replace(`/articles/${this.nest_srl}/${text.serialize(params, true)}`);

        this.processing = true;

        // get articles
        let paramsArticle = Object.assign({}, src.defaultParamsArticle);
        paramsArticle.nest = this.nest_srl;
        paramsArticle.size = this.size;
        paramsArticle.page = page;
        if (this.category_srl) paramsArticle.category = this.category_srl;
        const articles = await this.$axios.$get(`/articles/${text.serialize(paramsArticle, true)}`);

        // update data
        this.total = articles.success ? articles.data.total : 0;
        this.articles = articles.success ? articles.data.index : null;
        this.page = page;
        this.processing = false;
      }
      catch(e)
      {
        this.processing = false;
        return { error: (typeof e === 'string') ? e : messages.error.service };
      }
    },
    setCategoryUrl(srl)
    {
      let params = '';
      switch(srl)
      {
        case '':
          params = '';
          break;
        case 'none':
          params = '?category=null';
          break;
        default:
          params = srl ? `?category=${srl}` : '';
          break;
      }
      return `/articles/${this.nest_srl}/${params}`;
    },
  },
}
</script>
