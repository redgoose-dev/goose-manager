<template>
<div class="articles-index">
  <loading v-if="loading"/>
  <index-wrap v-else-if="!!articles && articles.length" :column="computedColumn">
    <component
      v-for="(item,key) in articles" :key="key"
      v-bind:is="`item-${useSkin}`"
      :image="(item.json && item.json.thumbnail) ? getImageUrl(item.json.thumbnail.path) : null"
      :link="`./${item.srl}/`"
      :title="item.title"
      :alt="item.title"
      :metas="[
        `${getType(item.type)}`,
        getDate(item),
        item.category_name,
        `hit:${item.hit}`,
      ]"
      :navs="[
        { label: 'Edit', link: `./${item.srl}/edit/` },
        { label: 'Delete', link: `./${item.srl}/delete/` }
      ]"/>
  </index-wrap>
  <error v-else type="empty" size="large"/>
</div>
</template>

<script>
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
  components: {
    'loading': () => import('~/components/etc/loading'),
    'item-list': () => import('~/components/item/list'),
    'item-card': () => import('~/components/item/card'),
    'item-thumbnail': () => import('~/components/item/thumbnail'),
    'error': () => import('~/components/contents/error'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
  },
  props: {
    articles: { type: Array, default: null },
    loading: { type: Boolean, default: false },
    skin: { type: String, default: 'thumbnail' }
  },
  computed: {
    useSkin()
    {
      switch(this.skin)
      {
        case 'list':
          return 'list';
        case 'card':
          return 'card';
        case 'thumbnail':
        default:
          return 'thumbnail';
      }
    },
    computedColumn()
    {
      switch (this.skin) {
        case 'card':
          return 3;
        case 'thumbnail':
          return 4;
        case 'list':
        default:
          return 1;
      }
    },
  },
  methods: {
    getDate(item)
    {
      const { preference } = this.$store.state;
      switch (preference.articles.displayDateField)
      {
        case 'order':
          return dates.getFormatDate(item.order, false);
        case 'regdate':
        default:
          return dates.getFormatDate(item.regdate, false);
      }
    },
    getImageUrl(path)
    {
      if (!path) return null;
      return `${this.$store.state.url_api}/${path}`;
    },
    getType(type)
    {
      return text.getArticleType(type);
    },
  },
}
</script>
