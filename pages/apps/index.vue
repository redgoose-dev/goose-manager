<template>
<article>
  <page-header module="apps"/>

  <error v-if="!!error" :message="error"/>
  <error v-else-if="!(index && index.length)" type="empty"/>
  <div v-else class="rg-index-list">
    <ul>
      <li v-for="(item,key) in index" :key="key">
        <item-list
          :title="item.name"
          :alt="item.name"
          :description="item.description"
          :use-image="false"
          :metas="[
            `srl: ${item.srl}`,
            `id: ${item.id}`,
            `date: ${item.regdate}`]"
          :navs="[
            { label: 'Edit', link: `/apps/${item.srl}/edit/` },
            { label: 'Delete', link: `/apps/${item.srl}/delete/` }
          ]"/>
      </li>
    </ul>
  </div>

  <nav-bottom>
    <template slot="left">
      <button-basic label="Nests" to="/nests/"/>
    </template>
    <template slot="right">
      <button-basic label="Add App" to="/apps/add/" color="key"/>
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