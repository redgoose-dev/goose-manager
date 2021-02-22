<template>
<article class="checklist">
  <page-header module="checklist" title="Checklist / Item"/>
  <div class="checklist__body">
    <checklist-item
      v-model="content"
      :srl="srl"
      :current-date="computedCurrentDate"
      :regdate="regdate"
      :percent="computedPercent"
      :shortcut-event="false"/>
    <nav-bottom class="checklist__bottom">
      <template slot="left">
        <button-basic href="../list/" icon-left="list">List</button-basic>
      </template>
      <template slot="right">
        <button-basic href="../" icon-left="check" color="key">Go to Today</button-basic>
        <button-basic href="./edit/" color="gray" icon-left="edit">Edit</button-basic>
        <button-basic href="./delete/" icon-left="trash">Delete</button-basic>
      </template>
    </nav-bottom>
  </div>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import { checkTime, countingCheckbox } from '~/components/pages/checklist/src';
import { dateFormat } from '~/libs/dates';

export default {
  name: 'page-checklist-item',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'checklist-item': () => import('~/components/pages/checklist/item'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'button-basic': () => import('~/components/button/basic'),
  },
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  async asyncData(context)
  {
    const { $axios, error, params } = context;
    try
    {
      let srl = Number(params.srl);
      let res = await $axios.$get(`/checklist/${srl}/`);
      if (!res.success) throw res.message;
      return {
        srl,
        content: res.data.content,
        regdate: res.data.regdate,
        percent: Number(res.data.percent),
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
    computedCurrentDate()
    {
      const { preference } = this.$store.state;
      return !checkTime(this.regdate, preference.checklist.reset);
    },
    computedDate()
    {
      const { preference } = this.$store.state;
      const regdate = this.regdate.split(' ')[0].split('-').map(o => Number(o));
      return dateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), preference.checklist.format);
    },
    computedPercent()
    {
      if (!this.computedCurrentDate) return this.percent;
      if (!this.content) return 0;
      const { percent } = countingCheckbox(this.content);
      return percent;
    },
  },
}
</script>

<style lang="scss" scoped>
.checklist {
  &__body {
    margin: auto;
    max-width: 768px;
  }
}
</style>
