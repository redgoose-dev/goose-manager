<template>
<article class="checklist">
  <page-header module="checklist">
    <button-icon
      href="/checklist/list/"
      icon-name="archive"
      title="Checklist list"
      class="checklist__header-button"/>
  </page-header>
  <checklist-item
    :srl="srl"
    :current-date="computedCurrentDate"
    v-model="content"
    :regdate="regdate"/>
  <checklist-progress
    :srl="srl"
    :current-date="computedCurrentDate"
    :percent="computedPercent"
    class="checklist__progress"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import { checkTime, countingCheckbox, getLastItem } from '~/components/pages/checklist/src';

export default {
  name: 'page-checklist',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'button-icon': () => import('~/components/button/icon'),
    'checklist-item': () => import('~/components/pages/checklist/item'),
    'checklist-progress': () => import('~/components/pages/checklist/progress'),
  },
  async asyncData(context)
  {
    const { store, $axios, error } = context;
    const { preference } = store.state;
    try
    {
      let item = await getLastItem($axios, preference.checklist.reset);
      return {
        srl: Number(item.srl),
        content: item.content,
        regdate: item.regdate,
      };
    }
    catch(e)
    {
      error({
        statusCode: 500,
        message: (typeof e === 'string') ? e : messages.error.service,
      });
    }
  },
  computed: {
    computedPercent()
    {
      if (!this.content) return 0;
      const { percent } = countingCheckbox(this.content);
      return percent;
    },
    computedCurrentDate()
    {
      const { preference } = this.$store.state;
      return !checkTime(this.regdate, preference.checklist.reset);
    },
  },
  methods: {
    //
  },
}
</script>

<style src="./index.scss" lang="scss"></style>
