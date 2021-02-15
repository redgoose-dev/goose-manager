<template>
<article class="checklist">
  <page-header module="checklist">
    <button-icon
      href="/checklist/items/"
      icon-name="archive"
      title="Open checklist items"
      class="checklist__header-button"/>
  </page-header>
  <article class="checklist__wrap">
    <header class="checklist__head">
      <h3>{{computedDate}}</h3>
    </header>
    <div
      ref="checklist-body"
      v-html="`foo`"
      class="checklist__body"/>
  </article>
  <checklist-progress
    :percent="10"
    class="checklist__progress"/>
  <nuxt-child/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import { checkTime } from '~/components/pages/checklist/src';

const defaultContent = `- [ ] content body\n- [ ] content body\n\n`;

export default {
  name: 'page-checklist',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-icon': () => import('~/components/button/icon'),
    'checklist-progress': () => import('~/components/pages/checklist/progress'),
  },
  async asyncData(context)
  {
    const { query, store, $axios } = context;
    const { preference } = store.state;
    const getPath = `/checklist/?order=srl&sort=desc&size=1`;
    try
    {
      let item;
      let res = await $axios.$get(getPath);
      let lastItem = res?.data?.index[0];
      if (!lastItem || (!!lastItem && checkTime(lastItem.regdate, preference.checklist.reset)))
      {
        let res = await $axios.$post('/checklist/?return=1', {
          content: (lastItem?.content) ? lastItem.content.replace(/\- \[x\]/g, '- [ ]') : defaultContent,
        });
        item = res?.data;
      }
      else
      {
        item = lastItem;
      }
      return {
        content: item.body,
        regdate: item.regdate,
      };
    }
    catch(e)
    {
      return { error: (typeof e === 'string') ? e : messages.error.service };
    }
  },
  computed: {
    computedDate()
    {
      return 'dateeee';
    },
  },
  watch: {
    //
  },
  methods: {
    //
  },
  mounted()
  {
    // console.log(this)
  },
}
</script>

<style src="./checklist.scss" lang="scss" scoped></style>
