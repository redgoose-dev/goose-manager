<template>
<article class="checklist">
  <page-header module="checklist"/>
  <div class="checklist__body">
    <checklist-item
      v-model="content"
      :srl="srl"
      :current-date="computedCurrentDate"
      :regdate="regdate"
      :shortcut-event="true"/>
    <nav-bottom class="checklist__bottom">
      <template slot="left">
        <button-basic href="./list/" icon-left="list">List</button-basic>
      </template>
      <template slot="right">
        <button-basic href="./edit/" color="key" icon-left="edit">Edit</button-basic>
      </template>
    </nav-bottom>
  </div>
  <checklist-progress :percent="computedPercent"/>
</article>
</template>

<script>
import * as messages from '~/libs/messages';
import { checkTime, countingCheckbox, getLastItem } from '~/components/pages/checklist/src';

export default {
  name: 'page-checklist',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'checklist-item': () => import('~/components/pages/checklist/item'),
    'checklist-progress': () => import('~/components/pages/checklist/progress'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'button-basic': () => import('~/components/button/basic'),
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
}
</script>

<style lang="scss" scoped>
.checklist {
  &__body {
    margin: auto;
    max-width: 768px;
  }
  &__bottom {
    margin-bottom: 30px;
  }
}
</style>
