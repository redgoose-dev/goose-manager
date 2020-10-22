<template>
<div class="articles-index">
  <loading v-if="loading"/>
  <index-wrap v-else-if="!!articles && articles.length" :type="computedIndexType">
    <component
      v-for="(item,key) in articles" :key="key"
      v-bind:is="`item-${computedUseSkin}`"
      :type="item.type"
      :image="(item.json && item.json.thumbnail) ? getImageUrl(item.json.thumbnail.path) : null"
      :href="`./${item.srl}/${getQuery(item)}`"
      :title="item.title"
      :alt="item.title"
      :metas="[
        `${getType(item.type)}`,
        getDate(item),
        item.category_name,
        `hit:${item.hit}`,
      ]"
      :navs="[
        { label: 'Edit', link: `./${item.srl}/edit/${getQuery(item)}` },
        { label: 'Delete', link: `./${item.srl}/delete/${getQuery(item)}` },
      ]"/>
  </index-wrap>
  <error v-else type="empty" size="large"/>
</div>
</template>

<script>
import * as dates from '~/libs/dates';
import * as text from '~/libs/text';

export default {
  name: 'index-articles',
  components: {
    'loading': () => import('~/components/etc/loading'),
    'item-list': () => import('~/components/item/list'),
    'item-card': () => import('~/components/item/card'),
    'item-thumbnail': () => import('~/components/item/thumbnail'),
    'item-brick': () => import('~/components/item/brick'),
    'error': () => import('~/components/contents/error'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
  },
  props: {
    articles: { type: Array, default: null },
    loading: { type: Boolean, default: false },
    skin: { type: String, default: 'thumbnail' }, // list,card,thumbnail,brick
    funcGetQuery: { type: Function }, // 링크주소 쿼리를 만들기 위하여 부모 컴포넌트에서 처리하는 함수
  },
  computed: {
    computedUseSkin()
    {
      switch(this.skin)
      {
        case 'list':
          return 'list';
        case 'card':
          return 'card';
        case 'brick':
          return 'brick';
        case 'thumbnail':
        default:
          return 'thumbnail';
      }
    },
    computedIndexType()
    {
      switch (this.computedUseSkin)
      {
        case 'card':
        case 'thumbnail':
        default:
          return 'grid';
        case 'brick':
          return 'brick';
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
    getQuery(item)
    {
      return (this.funcGetQuery && typeof this.funcGetQuery === 'function') ? this.funcGetQuery(item) : '';
    },
  },
}
</script>
