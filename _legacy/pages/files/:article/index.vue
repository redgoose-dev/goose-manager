<template>
<article>
  <page-header module="files"/>
  <error v-if="!!error" :message="error" size="large"/>
  <loading v-else-if="processing"/>
  <error v-else-if="!(index && index.length)" type="empty" size="large"/>
  <template v-else>
    <index-wrap type="brick" class="files__index">
      <item-brick
        v-for="(item,key) in index"
        :key="key"
        :href="`${url_api}/${item.path}`"
        target="_blank"
        :title="item.name"
        :alt="item.name"
        :image="`${url_api}/${item.path}`"
        :metas="[
          `${item.type}`,
          `Size: ${getFileSize(item.size)}`,
          `article_srl: ${item.target_srl}`,
          `${getDate(item.regdate)}`,
        ]"/>
    </index-wrap>
    <paginate
      v-if="!!total"
      v-model="page"
      type="nuxt-link"
      url="/files/"
      :total="total"
      :size="size"
      :page-range="10"
      :show-range-direction="true"
      :show-end-direction="true"/>
  </template>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';
import * as object from '~/libs/object';

const defaultParams = {
  order: 'srl',
  sort: 'desc',
};

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'item-brick': () => import('~/components/item/brick'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
    'paginate': () => import('~/components/etc/paginate'),
    'loading': () => import('~/components/etc/loading'),
  },
  validate(context)
  {
    if (!context.params.article) return true;
    return /^\d+$/.test(context.params.article);
  },
  async asyncData(context)
  {
    const { preference } = context.store.state;
    try
    {
      const page = parseInt(context.query.page || 1);
      const article_srl = context.params.article ? parseInt(context.params.article) : null;
      let params = {
        ...defaultParams,
        size: object.getValue(preference, 'files', 'pageCount') || 24,
      };
      if (article_srl) params.article = article_srl;
      if (page > 1) params.page = page;

      // get datas
      let files = await context.$axios.$get(`/files/${text.serialize(params, true)}`);
      if (!files.success) throw files.message;

      return {
        article_srl,
        url_api: context.store.state.url_api,
        total: files.data.total,
        index: files.data.index,
        size: params.size,
        page,
        error: null,
        processing: false,
      };
    }
    catch(e)
    {
      return { error: (typeof e === 'string') ? e : messages.error.service };
    }
  },
  watch: {
    '$route': async function()
    {
      const { $route } = this;
      this.page = parseInt($route.query.page) || 1;
      this.processing = true;
      try
      {
        let params = {
          ...defaultParams,
          size: this.size,
          page: this.page,
        };
        if (this.article_srl) params.article = this.article_srl;
        // get datas
        let files = await this.$axios.$get(`/files/${text.serialize(params, true)}`);
        if (!files.success) throw files.message;
        // update data
        this.error = null;
        this.total = files.data.total;
        this.index = files.data.index;
        this.processing = false;
      }
      catch(e)
      {
        this.processing = false;
        this.error = (typeof e === 'string') ? e : messages.error.service;
      }
    },
  },
  methods: {
    getDate(date)
    {
      return dates.getFormatDate(date, false);
    },
    getFileSize(size)
    {
      return text.getFileSize(size);
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
