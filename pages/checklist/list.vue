<template>
<article class="checklist-items">
  <page-header module="checklist" title="Checklist / List">
    <button-basic href="../" icon-left="check" color="key" size="small">
      Go to Today
    </button-basic>
  </page-header>
  <side-filter-wrapper class="checklist-items__body">
    <template slot="side">
      <side-filter-meta-items :items="[{ label: 'Total', value: computedTotal }]"/>
      <hr class="section-line">
      <side-filter-section label="Date range" name="filter_range">
        <form-select
          id="filter_range"
          name="filter_range"
          v-model="filter.year"
          size="mini"
          placeholder="년도 선택하기"
          :options="tree.year"
          @change="onChangeFilter"/>
        <form-select
          v-model="filter.month"
          size="mini"
          placeholder="월 선택하기"
          :options="tree.month"
          @change="onChangeFilter"/>
      </side-filter-section>
      <side-filter-section label="Sort" name="filter_sort">
        <form-select
          id="filter_sort"
          name="filter_sort"
          v-model="filter.sort"
          size="mini"
          :placeholder="null"
          :options="[
            { label: 'A to Z', value: 'asc' },
            { label: 'Z to A', value: 'desc' },
          ]"
          @change="onChangeFilter"/>
      </side-filter-section>
      <side-filter-section label="Keyword" name="filter_keyword">
        <form-keyword
          name="filter_keyword"
          id="filter_keyword"
          v-model="keyword"
          form-size="mini"
          placeholder="Keyword"
          :processing="false"
          @clear="keyword = ''"
          @submit="onSubmitKeywordInFilter"/>
      </side-filter-section>
    </template>
    <template slot="body">
      <loading v-if="processing"/>
      <error v-else-if="!!error" :message="error" size="large"/>
      <index-wrap v-else type="grid" class="checklist-items__index">
        <item-card
          v-for="(item,key) in computedItems"
          :key="key"
          :title="item.title"
          :href="`/checklist/${item.srl}/`"
          :alt="item.title"
          :metas="[ `Progress: ${item.percent}%` ]"
          :navs="[
            { label: 'Edit', link: `/checklist/${item.srl}/edit/` },
            { label: 'Delete', link: `/checklist/${item.srl}/delete/` },
          ]"
          :use-image="false"/>
      </index-wrap>
      <paginate
        v-if="!!total && !(filter.year && filter.month)"
        type="nuxt-link"
        v-model="page"
        url="./"
        :total="total"
        :size="computedSize"
        :params="keyword ? { q: keyword } : null"
        :page-range="10"
        :show-direction="false"
        :show-range-direction="true"
        :show-end-direction="true"
        @change="page = $event"/>
    </template>
  </side-filter-wrapper>
</article>
</template>

<script>
import * as object from '~/libs/object';
import * as text from '~/libs/text';
import * as number from '~/libs/number';
import * as messages from '~/libs/messages';
import { dateFormat, month } from '~/libs/dates';

export default {
  name: 'page-checklist-list',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
    'item-card': () => import('~/components/item/card'),
    'error': () => import('~/components/contents/error'),
    'loading': () => import('~/components/etc/loading'),
    'paginate': () => import('~/components/etc/paginate'),
    'button-basic': () => import('~/components/button/basic'),
    'side-filter-wrapper': () => import('~/components/contents/side-filter/wrapper'),
    'side-filter-meta-items': () => import('~/components/contents/side-filter/meta-items'),
    'side-filter-section': () => import('~/components/contents/side-filter/section'),
    'form-select': () => import('~/components/form/select'),
    'form-keyword': () => import('~/components/form/keyword'),
  },
  data()
  {
    const { $store, $route } = this;
    const { preference } = $store.state;
    const preferenceFilter = object.getValue(preference, 'checklist', 'filter');

    return {
      page: Number($route.query.page || 1),
      size: 20,
      filter: {
        year: preferenceFilter.year,
        month: preferenceFilter.month,
        sort: preferenceFilter.sort,
      },
      keyword: $route.query.q || '',
      processing: false,
      error: null,
      total: 0,
      items: [],
    };
  },
  computed: {
    computedItems()
    {
      const { preference } = this.$store.state;
      return this.items.map(item => {
        const regdate = item.regdate.split(' ')[0].split('-').map(o => Number(o));
        const date = new Date(regdate[0], regdate[1] - 1, regdate[2]);
        return {
          ...item,
          title: dateFormat(date, preference.checklist.format),
        };
      });
    },
    computedTotal()
    {
      return number.withCommas(this.total) || 0;
    },
    computedSize()
    {
      return (this.filter.year && this.filter.month) ? 40 : this.size;
    },
  },
  watch: {
    '$route': function()
    {
      this.updateItems().then();
    },
  },
  created()
  {
    this.tree = {
      month: month.map((o, k) => ({ label: o, value: k + 1 })),
      year: object.range(2020, 2030, 1).map(o => ({ label: o, value: o })),
    };
  },
  mounted()
  {
    this.updateItems().then();
  },
  methods: {
    async updateItems()
    {
      const { $route, $axios } = this;
      this.page = parseInt($route.query.page) || 1;
      this.keyword = $route.query.q || '';
      this.processing = true;
      try
      {
        let params = {
          field: 'srl,percent,regdate',
          order: 'srl',
          size: this.computedSize,
          page: this.page,
          sort: this.filter.sort,
        };
        if (this.filter.year && this.filter.month)
        {
          let date = new Date(this.filter.year, this.filter.month - 1, 1);
          params.start = dateFormat(date, '{yyyy}-{MM}-{dd}');
          date = new Date(this.filter.year, this.filter.month, 0);
          params.end = dateFormat(date, '{yyyy}-{MM}-{dd}');
        }
        if (this.keyword) params.q = this.keyword;
        let res = await $axios.$get(`/checklist/${text.serialize(params, true)}`);
        if (!res.success) throw res.message;
        this.total = res.data.total;
        this.items = res.data.index;
        this.error = null;
      }
      catch(e)
      {
        this.error = (typeof e === 'string') ? e : messages.error.service;
      }
      this.processing = false;
    },
    async onChangeFilter()
    {
      // update preference
      let params = [{ key: 'checklist.filter', value: this.filter }];
      this.$store.dispatch('updatePreference', params).then();
      // update items
      this.updateItems().then();
    },
    onSubmitKeywordInFilter(keyword)
    {
      if (keyword.length < 2 && keyword.length > 0) return;
      let params = {};
      if (keyword) params.q = keyword;
      this.$router.push(`./${text.serialize(params, true)}`);
    },
  },
}
</script>

<style src="./list.scss" lang="scss" scoped></style>
