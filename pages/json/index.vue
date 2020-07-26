<template>
<article>
  <page-header module="json"/>

  <error v-if="!!error" :message="error" size="large"/>
  <error v-else-if="!(index && index.length)" type="empty" size="large"/>
  <index-wrap v-else type="grid">
    <item-list
      v-for="(item,key) in index" :key="key"
      :title="item.name"
      :description="item.description"
      :link="`/json/${item.srl}/`"
      :use-image="false"
      :metas="[
        `srl: ${item.srl}`,
        `regdate: ${item.regdate}`
      ]"
      :navs="[
        { label: 'Edit', link: `/json/${item.srl}/edit/` },
        { label: 'Delete', link: `/json/${item.srl}/delete/` },
      ]"/>
  </index-wrap>

  <nav-bottom>
    <template slot="right">
      <button-basic to="./add/" color="key" icon-left="plus">Add JSON</button-basic>
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
    'item-list': () => import('~/components/item/list'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
  },
  async asyncData(cox)
  {
    try
    {
      let res = await cox.$axios.$get('/json/?order=srl&sort=desc');
      if (!(res && res.success)) throw messages.service.noItem;
      return {
        index: res.data.index.map((o) => {
          o.srl = parseInt(o.srl);
          o.regdate = dates.getFormatDate(o.regdate, false);
          return o;
        }),
        error: null,
      };
    }
    catch(e)
    {
      return { error: (typeof e === 'string') ? e : messages.error.service };
    }
  },
}
</script>
