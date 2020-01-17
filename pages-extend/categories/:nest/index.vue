<template>
<article>
  <page-header module="categories"/>

  <error v-if="!!error" :message="error"/>
  <error v-else-if="!(computedIndex && computedIndex.length)" type="empty"/>
  <draggable
    v-else
    v-model="categories"
    tag="div"
    @start="onStartSort"
    @end="onEndSort"
    handle=".move"
    class="index">
    <item-card
      v-for="(item,key) in computedIndex" :key="item.srl"
      :title="`[${item.srl}] ${item.name}`"
      :use-image="false"
      :metas="[
        `Nest srl: ${item.nest_srl}`,
        `Date: ${getDate(item.regdate)}`
      ]"
      :navs="[
        { label: 'Edit', link: `./${item.srl}/edit/` },
        { label: 'Delete', link: `./${item.srl}/delete/` },
      ]">
      <button
        v-if="!!nest_srl"
        slot="before"
        type="button"
        title="Move item"
        class="move">
        <icon name="move"/>
      </button>
    </item-card>
  </draggable>

  <nav-bottom>
    <template v-if="nest_srl" slot="left">
      <button-basic to="/nests/" icon-left="cloud">Nests</button-basic>
      <button-basic :to="`/nests/${nest_srl}/articles/`" icon-left="droplet">Articles</button-basic>
    </template>
    <template v-else slot="left">
      <button-basic to="/nests/" icon-left="archive">Nests</button-basic>
    </template>
    <template v-if="nest_srl" slot="right">
      <button-basic to="./add/" color="key">Add Category</button-basic>
    </template>
  </nav-bottom>
</article>
</template>

<script>
import { formData } from '~/libs/forms';
import * as messages from '~/libs/messages';
import * as dates from '~/libs/dates';

let srls = null;

export default {
  components: {
    'draggable': () => import('vuedraggable'),
    'page-header': () => import('~/components/contents/page-header'),
    'item-card': () => import('~/components/item/card'),
    'button-basic': () => import('~/components/button/basic'),
    'error': () => import('~/components/contents/error'),
    'nav-bottom': () => import('~/components/contents/nav-bottom'),
    'icon': () => import('~/components/icon'),
  },
  validate(cox)
  {
    if (!cox.params.nest) return true;
    return /^\d+$/.test(cox.params.nest);
  },
  async asyncData(cox)
  {
    let nest_srl = parseInt(cox.params.nest) || null;
    try
    {
      let url = (nest_srl) ? `/categories/?nest=${nest_srl}&order=turn&sort=asc` : '/categories/';
      let categories = await cox.$axios.$get(url);
      if (!categories.success) throw categories.message;
      return {
        nest_srl,
        total: categories.success ? categories.data.total : 0,
        categories: categories.success ? categories.data.index : null,
        error: null,
      };
    }
    catch(e)
    {
      return {
        nest_srl,
        error: (typeof e === 'string') ? e : messages.error.service
      };
    }
  },
  computed: {
    computedIndex()
    {
      return !!this.categories && this.categories.length ? this.categories : [];
    },
  },
  methods: {
    getDate(date)
    {
      return dates.getFormatDate(date, false);
    },
    onStartSort()
    {
      srls = this.categories.map((o, k) => (o.srl)).join(',');
    },
    async onEndSort(e)
    {
      if (!this.nest_srl) return;
      try
      {
        // make end srls
        let endSrls = this.categories.map((o, k) => (o.srl)).join(',');
        // check srls
        if (srls === endSrls) return;
        // update sort
        const data = formData({
          nest_srl: this.nest_srl || null,
          srls: endSrls
        });
        let res = await this.$axios.$post('/categories/sort/', data);
        if (!res.success) throw res.message;
        this.$toast.add({
          message: 'Success change sort.',
          color: 'success',
        });
      }
      catch(e)
      {
        if (e === messages.error.service) e = null;
        this.$toast.add({
          message: (e && typeof e === 'string') ? e : `Failed ${this.type} category.`,
          color: 'error',
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables";
@import "../../../assets/scss/mixins";
.index {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-gap: $size-grid-col-gap;
}
.move {
  position: relative;
  display: block;
  margin: 0 -15px 0 0;
  padding: 0 22px;
  background: none;
  border: none;
  height: 100%;
  cursor: move;
  outline: none;
  font-size: 0;
  user-select: none;
  svg {
    display: block;
    width: 18px;
    height: 18px;
    stroke-width: 1.5;
    color: var(--color-blur);
  }
}
.sortable-ghost {
  opacity: .1;
}
</style>
