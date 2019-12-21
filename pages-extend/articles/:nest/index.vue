<template>
<article>
  <page-header
    module="articles"
    :title="`${nest ? `[${nest.name}] ` : ''}Articles`"
    :description="computedDescription"/>
  <error v-if="!!error" :message="error" size="large"/>
  <template v-else>
    <index-categories
      :nest_srl="nest_srl"
      :categories="categories"
      :category_srl="category_srl"
      @change="category_srl = $event"/>
    <index-articles
      :articles="articles"
      :skin="skin"
      :loading="processing"/>
    <paginate
      v-if="!!total"
      type="nuxt-link"
      v-model="page"
      url="./"
      :params="category_srl ? { category: category_srl }: {}"
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
      <button-basic label="Nests" to="../../" icon-left="archive"/>
      <button-basic
        v-if="(nest && parseInt(nest.json.useCategory) === 1)"
        label="Categories"
        :to="`../../${nest_srl}/categories/`"
        icon-left="server"/>
    </template>
    <template slot="right">
      <button-basic
        label="Add article"
        :to="`./add/${category_srl ? `?category=${category_srl}` : ''}`"
        color="key"
        icon-left="plus"/>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as text from '~/libs/text';
import * as object from '~/libs/object';

const defaultParamsArticle = {
  field: 'srl,type,title,hit,regdate,category_srl,json,`order`',
  ext_field: 'category_name',
  order: 'srl',
  sort: 'desc',
  visible_type: 'all',
};
const defaultParamsCategory = {
  ext_field: 'count_article,item_all,none',
  order: 'turn',
  sort: 'asc',
};

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
  validate(cox)
  {
    return cox.params.nest && /^\d+$/.test(cox.params.nest);
  },
  async asyncData(context)
  {
    const { preference } = context.store.state;
    const page = parseInt(context.query.page || 1);
    const size = object.getValue(preference, 'articles', 'pageCount') || 20;
    const nest_srl = parseInt(context.params.nest) || null;
    const category_srl = context.query.category || null;

    // set params for articles
    let paramsArticle = Object.assign({}, defaultParamsArticle);
    paramsArticle.nest = nest_srl;
    paramsArticle.size = size;
    if (page > 1) paramsArticle.page = page;
    if (category_srl) paramsArticle.category = category_srl;
    // set params for category
    let paramsCategory = Object.assign({}, defaultParamsCategory);
    paramsCategory.nest = nest_srl;

    try
    {
      const [ categories, articles, nest ] = await Promise.all([
        context.$axios.$get(`/categories/${text.serialize(paramsCategory, true)}`),
        context.$axios.$get(`/articles/${text.serialize(paramsArticle, true)}`),
        context.$axios.$get(`/nests/${nest_srl}/?field=name,json,description`)
      ]);
      return {
        nest_srl,
        category_srl,
        page,
        size,
        error: null,
        processing: false,
        total: articles.success ? articles.data.total : 0,
        articles: articles.success ? articles.data.index : null,
        categories: categories.success ? categories.data.index : null,
        nest: nest.success ? nest.data : null,
        skin: nest.success && nest.data.json.articleSkin ? nest.data.json.articleSkin : null,
        pageRange: object.getValue(preference, 'articles', 'pageRange') || 10,
      };
    }
    catch(e)
    {
      return { error: (typeof e === 'string') ? e : messages.error.service };
    }
  },
  computed: {
    computedDescription()
    {
      return object.getValue(this.nest, 'description') || null;
    },
  },
  watch: {
    '$route': async function()
    {
      this.page = parseInt(this.$route.query.page) || 1;
      this.category_srl = this.$route.query.category || null;
      this.processing = true;

      // get articles
      try
      {
        let paramsArticle = Object.assign({}, defaultParamsArticle);
        paramsArticle.nest = this.nest_srl;
        paramsArticle.size = this.size;
        paramsArticle.page = this.page;
        if (this.category_srl) paramsArticle.category = this.category_srl;
        const res = await this.$axios.$get(`/articles/${text.serialize(paramsArticle, true)}`);
        if (res.success && res.data)
        {
          this.total = res.data.total;
          this.articles = res.data.index;
        }
        else
        {
          this.total = 0;
          this.articles = null;
        }
        this.processing = false;
      }
      catch(e)
      {
        this.processing = false;
        return { error: (typeof e === 'string') ? e : messages.error.service };
      }
    },
  },
}
</script>