<template>
<article class="checklist-items">
  <page-header module="checklist" title="Checklist items"/>
  <side-filter-wrapper class="checklist-items__body">
    <template slot="side">
      <side-filter-meta-items :items="[{ label: 'Total', value: total }]"/>
      <hr class="section-line">
      <side-filter-section label="Date range" name="filter_range">
        <div class="rg-row rg-row-gutter-h">
          <div class="rg-col">
            <form-select
              id="filter_range"
              name="filter_range"
              v-model="filter.dateYear"
              size="mini"
              placeholder="년도 선택"
              :options="[
                { label: '2020', value: 2020 },
                { label: '2021', value: 2021 },
                { label: '2022', value: 2022 },
                { label: '2023', value: 2023 },
              ]"
              @change=""/>
          </div>
          <div class="rg-col">
            <form-select
              v-model="filter.dateMonth"
              size="mini"
              placeholder="월 선택"
              :options="[
                { label: '1월', value: 1 },
                { label: '2월', value: 2 },
                { label: '3월', value: 3 },
                { label: '4월', value: 4 },
              ]"
              @change=""/>
          </div>
        </div>
      </side-filter-section>
      <side-filter-section label="Keyword" name="filter_keyword">
        <form-keyword
          v-model="filter.keyword"
          form-size="mini"
          placeholder="Keyword"
          :processing="false"
          @clear="filter.keyword = ''"
          @submit="onSubmitFilterKeyword"/>
      </side-filter-section>
    </template>
    <template slot="body">
      <loading v-if="loading"/>
      <error v-else-if="!!error" :message="error" size="large"/>
      <template v-else>
        <index-wrap type="grid" class="checklist-items__index">
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
          v-if="!!total"
          type="nuxt-link"
          v-model="page"
          url="./"
          :total="total"
          :size="size"
          :params="filter.keyword ? { q: filter.keyword } : null"
          :page-range="10"
          :show-direction="false"
          :show-range-direction="true"
          :show-end-direction="true"
          @change="page = $event"/>
      </template>
    </template>
  </side-filter-wrapper>
</article>
</template>

<script>
import * as object from '~/libs/object';
import * as text from '~/libs/text';
import * as messages from '~/libs/messages';
import { dateFormat } from '~/libs/dates';

export default {
  name: 'page-checklist-list',
  components: {
    'page-header': () => import('~/components/contents/page-header'),
    'index-wrap': () => import('~/components/contents/index-wrap'),
    'item-card': () => import('~/components/item/card'),
    'error': () => import('~/components/contents/error'),
    'loading': () => import('~/components/etc/loading'),
    'paginate': () => import('~/components/etc/paginate'),
    'side-filter-wrapper': () => import('~/components/contents/side-filter/wrapper'),
    'side-filter-meta-items': () => import('~/components/contents/side-filter/meta-items'),
    'side-filter-section': () => import('~/components/contents/side-filter/section'),
    'form-select': () => import('~/components/form/select'),
    'form-keyword': () => import('~/components/form/keyword'),
  },
  async asyncData(context)
  {
    const { query, store, $axios } = context;
    const { preference } = store.state;
    const preferenceFilter = object.getValue(preference, 'checklist', 'filter');
    let result = {
      page: Number(query.page || 1),
      size: 32,
      filter: {
        dateYear: preferenceFilter.year,
        dateMonth: preferenceFilter.month,
        keyword: query.q || null,
      },
      loading: false,
      processing: false,
      error: null,
      // items,
      // total,
    };
    try
    {
      let params = {
        size: result.size,
        page: result.page,
        order: 'srl',
        sort: 'desc',
      };
      if (result.filter.dateYear && result.filter.dateMonth)
      {
        let date = new Date(result.filter.dateYear, result.filter.dateMonth - 1, 1);
        params.start = dateFormat(date, '{yyyy}-{MM}-{dd}');
        date = new Date(result.filter.dateYear, result.filter.dateMonth, 0);
        params.end = dateFormat(date, '{yyyy}-{MM}-{dd}');
      }
      if (result.filter.keyword) params.q = result.filter.keyword;
      // get items
      let res = await $axios.$get(`/checklist/${text.serialize(params, true)}`);
      if (!res.success) throw res.message;
      result.total = res.success ? res.data.total : 0;
      result.items = res.success ? res.data.index : [];
    }
    catch(e)
    {
      result.error = (typeof e === 'string') ? e : messages.error.service;
    }
    return result;
  },
  computed: {
    computedItems()
    {
      const { preference } = this.$store.state;
      return this.items.map(item => {
        const regdate = item.regdate.split('-').map(o => Number(o));
        const date = new Date(regdate[0], regdate[1] - 1, regdate[2]);
        return {
          ...item,
          title: dateFormat(date, preference.checklist.format),
        };
      });
    },
  },
  methods: {
    async onSubmitFilterKeyword()
    {
      console.log('call onSubmitFilterKeyword()', this.filter.keyword);
    }
  }
}
</script>

<style src="./list.scss" lang="scss" scoped></style>
