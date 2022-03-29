<template>
<form class="index-filter" @submit.prevent="">
  <div class="index-filter__section">
    <p><label for="filter_type">Type</label></p>
    <div>
      <form-select
        id="filter_type"
        name="filter_type"
        v-model="type"
        size="mini"
        :placeholder="null"
        :options="[
          { label: 'all', value: 'all' },
          { label: 'public', value: 'public' },
          { label: 'private', value: 'private' },
        ]"
        @change="update"/>
    </div>
  </div>
  <div class="index-filter__section">
    <p><label for="filter_sort">Sort</label></p>
    <div>
      <form-select
        v-model="order"
        id="filter_sort"
        name="filter_sort"
        size="mini"
        :placeholder="null"
        :options="[
          { label: 'srl', value: 'srl' },
          { label: 'order', value: 'order' },
        ]"
        @change="update"/>
      <form-select
        v-model="sort"
        size="mini"
        :placeholder="null"
        :options="[
          { label: 'A to Z', value: 'asc' },
          { label: 'Z to A', value: 'desc' },
        ]"
        @change="update"/>
    </div>
  </div>
  <div class="index-filter__section">
    <p><label for="filter_skin">Skin</label></p>
    <div>
      <form-select
        id="filter_skin"
        name="filter_skin"
        v-model="skin"
        size="mini"
        :placeholder="null"
        :options="[
          { label: 'list', value: 'list' },
          { label: 'card', value: 'card' },
          { label: 'thumbnail', value: 'thumbnail' },
          { label: 'brick', value: 'brick' },
        ]"
        @change="update"/>
    </div>
  </div>
  <div class="index-filter__section">
    <p><label for="filter_keyword">Keyword</label></p>
    <div>
      <form-search
        id="filter_keyword"
        name="filter_keyword"
        :processing="processing"
        :init="init"
        @submit="onSubmitSearch"/>
    </div>
  </div>
</form>
</template>

<script>
export default {
  name: 'index-filter',
  components: {
    'form-select': () => import('~/components/form/select'),
    'form-search': () => import('./form-search'),
  },
  props: {
    processing: { type: Boolean, default: false },
    init: { type: Object },
  },
  data()
  {
    const { preference } = this.$store.state;
    return {
      type: preference.articles.filter.type,
      order: preference.articles.filter.order,
      sort: preference.articles.filter.sort,
      skin: preference.articles.filter.skin,
    };
  },
  methods: {
    update()
    {
      this.$emit('change', {
        type: this.type,
        order: this.order,
        sort: this.sort,
        skin: this.skin,
      })
    },
    onSubmitSearch(o)
    {
      this.$emit('change-keyword', o);
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
