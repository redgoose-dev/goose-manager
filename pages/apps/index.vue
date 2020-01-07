<template>
<article>
  <page-header module="apps"/>

  <error v-if="!!error" :message="error" size="large"/>
  <error v-else-if="!(index && index.length)" type="empty" size="large"/>
  <index-wrap v-else :column="1" type="grid">
    <item-list
      v-for="(item,key) in index" :key="key"
      :title="item.name"
      :alt="item.name"
      :description="item.description"
      :use-image="false"
      :metas="[
        `srl: ${item.srl}`,
        `id: ${item.id}`,
        `date: ${item.regdate}`
      ]"
      :navs="[
        { label: 'Edit', link: `/apps/${item.srl}/edit/` },
        { label: 'Delete', link: `/apps/${item.srl}/delete/` }
      ]"/>
  </index-wrap>

  <nav-bottom>
    <template slot="right">
      <button-basic to="/apps/add/" color="key" icon-left="plus">Add App</button-basic>
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
    'index-wrap': () => import('~/components/contents/index-wrap'),
    'item-list': () => import('~/components/item/list'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
  },
  async asyncData(cox)
  {
    try
    {
      let res = await cox.$axios.$get('/apps/?order=srl&sort=asc&unlimit=1');
      if (!(res && res.success && res.data.index && res.data.index.length)) throw messages.service.noItem;
      return {
        index: res.data.index.map((o) => {
          o.regdate = dates.getFormatDate(o.regdate, false);
          return o;
        }),
        error: '',
      };
    }
    catch(e)
    {
      return { error: (typeof e === 'string') ? e : messages.error.service };
    }
  },
}
</script>
