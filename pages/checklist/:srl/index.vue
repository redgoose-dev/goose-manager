<template>
<article class="checklist">
  <page-header module="checklist" title="Checklist / Item"/>
  <checklist-item
    :srl="srl"
    :current-date="computedCurrentDate"
    v-model="content"
    :regdate="regdate"
    :percent="percent"/>
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
  },
}
</script>

<style lang="scss" scoped>
.checklist {
  &__date {
    margin: 0;
    padding: 12px 0;
    background-color: var(--color-content-bg);
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    strong {
      font-weight: 700;
      color: var(--color-primary);
    }
  }
}
</style>
