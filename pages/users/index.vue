<template>
<article>
  <page-header module="users"/>

  <error v-if="!!error" :message="error" size="large"/>
  <error v-else-if="!(index && index.length)" type="empty" size="large"/>
  <index-wrap v-else :column="1">
    <item-list
      v-for="(item,key) in index" :key="key"
      :link="`/users/${item.srl}/`"
      :title="item.email"
      :use-image="false"
      :metas="[
        `Name: ${item.name}`,
        item.regdate,
        `Admin: ${item.admin ? 'Yes' : 'No'}`
      ]"
      :navs="[
        { label: 'Edit', link: `/users/${item.srl}/edit/` },
        { label: 'Delete', link: `/users/${item.srl}/delete/` },
        { label: 'Change password', link: `/users/${item.srl}/change-password/` },
      ]"/>
  </index-wrap>

  <nav-bottom>
    <template slot="right">
      <button-basic label="Add user" to="/users/add/" :inline="true" color="key" icon-left="plus"/>
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
      let res = await cox.$axios.$get('/users/?order=srl&sort=desc');
      if (!(res && res.success)) throw messages.service.noItem;
      return {
        index: res.data.index.map((o) => {
          o.srl = parseInt(o.srl);
          o.regdate = dates.getFormatDate(o.regdate, false);
          o.admin = parseInt(o.admin) === 2;
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
