<template>
<article>
  <page-header module="articles"/>
  <error v-if="!!error" :message="error" size="large"/>
  <template v-else>
    <index-articles
      :articles="articles"
      :loading="processing"
      skin="card"/>
    <paginate
      v-if="!!total"
      type="nuxt-link"
      v-model="page"
      url="./"
      :total="total"
      :size="size"
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
  field: 'srl,title,hit,star,regdate,category_srl,json',
  ext_field: 'category_name',
  order: 'srl',
  sort: 'desc',
  visible_type: 'all',
};

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'index-articles': () => import('~/components/pages/articles/index-articles'),
    'paginate': () => import('~/components/etc/paginate'),
    'error': () => import('~/components/contents/error'),
  },
  async asyncData(context)
  {
    try
    {
      const { preference } = context.store.state;
      const page = parseInt(context.query.page || 1);
      const size = object.getValue(preference, 'articles', 'pageCount') || 20;
      let params = {
        ...defaultParams,
        size
      };
      if (page > 1) params.page = page;

      // get articles
      const articles = await context.$axios.$get(`/articles/${text.serialize(params, true)}`);
      if (!articles.success) throw articles.message;

      return {
        total: articles.success ? articles.data.total : 0,
        articles: articles.success ? articles.data.index : [],
        page,
        size,
        processing: false,
        error: null,
        pageRange: object.getValue(preference, 'articles', 'pageRange') || 10,
      };
    }
    catch(e)
    {
      return {
        error: (typeof e === 'string') ? e : messages.error.service,
      };
    }
  },
  watch: {
    '$route': async function()
    {
      this.page = parseInt(this.$route.query.page) || 1;
      this.processing = true;
      try
      {
        // get articles
        let params = {
          ...defaultParams,
          size: this.size,
          page: this.page,
        };
        const articles = await this.$axios.$get(`/articles/${text.serialize(params, true)}`);
        if (!articles.success) throw articles.message;
        // update data
        this.error = null;
        this.total = articles.data.total;
        this.articles = articles.data.index;
      }
      catch(e)
      {
        this.processing = false;
        this.error = (typeof e === 'string') ? e : messages.error.service;
      }
      this.processing = false;
    },
  },
}
</script>
