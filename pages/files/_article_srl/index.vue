<template>
<article>
  <page-header module="files"/>

  <error v-if="!!error" :message="error"/>
  <error v-else-if="!(index && index.length)" type="empty"/>
  <div v-else class="rg-index-thumbnail">
    <ul>
      <li v-for="(item,key) in index" :key="key">
        <item-thumbnail
          :href="`${url_api}/${item.loc}`"
          target="_blank"
          :title="item.name"
          :image="`${url_api}/${item.loc}`"
          :metas="[
            `${item.type}`,
            `Size: ${getFileSize(item.size)}`,
            `article_srl: ${item.article_srl}`,
            `${getDate(item.regdate)}`,
          ]"/>
      </li>
    </ul>
  </div>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'item-thumbnail': () => import('~/components/item/thumbnail'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
  },
  validate(cox)
  {
    if (!cox.params.article_srl) return true;
    return /^\d+$/.test(cox.params.article_srl);
  },
  async asyncData(cox)
  {
    try
    {
      let article_srl = cox.params.article_srl ? parseInt(cox.params.article_srl) : null;
      let files = await cox.$axios.$get(`/files/?order=srl&sort=desc${article_srl ? `&article=${article_srl}` : ''}`);
      if (!files.success) throw files.message;
      return {
        article_srl,
        url_api: cox.store.state.url_api,
        total: files.data.total,
        index: files.data.index,
        error: null,
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
    getFileSize(size)
    {
      return text.getFileSize(size);
    },
  },
}
</script>