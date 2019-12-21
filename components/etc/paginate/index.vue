<template>
<nav class="paginate">
  <item-button
    v-if="showEndDirection"
    :button-type="type"
    title="1 page"
    :link="getUrl(1)"
    :disabled="(current - pageRange) < 1"
    @click="onGotoPage(1)">
    <paginate-icon name="end-prev"/>
  </item-button>
  <item-button
    v-if="showRangeDirection"
    :button-type="type"
    :title="`${computedPrevRangePage} page`"
    :link="getUrl(computedPrevRangePage)"
    :disabled="(current - pageRange) < 1"
    @click="onGotoPage(computedPrevRangePage)">
    <paginate-icon name="range-prev"/>
  </item-button>
  <item-button
    v-if="showDirection"
    :button-type="type"
    :title="`${computedPrevPage} page`"
    :link="getUrl(computedPrevPage)"
    :disabled="current < 2"
    @click="onGotoPage(computedPrevPage)">
    <paginate-icon name="prev"/>
  </item-button>
  <template v-for="page in computedPages">
    <i v-if="page.breakView" class="dots">
      <paginate-icon name="dots"/>
    </i>
    <button v-else-if="page.disabled" type="button" :disabled="true">
      {{page.content}}
    </button>
    <strong v-else-if="page.selected" :title="`${page.content} page`">
      {{page.content}}
    </strong>
    <item-button
      v-else
      :button-type="type"
      :title="`${page.content} page`"
      :link="`${getUrl(page.content)}`"
      @click="onGotoPage(page.content)">
      {{page.content}}
    </item-button>
  </template>
  <item-button
    v-if="showDirection"
    :button-type="type"
    :title="`${computedNextPage} page`"
    :link="getUrl(computedNextPage)"
    :disabled="current > (pageCount - 1)"
    @click="onGotoPage(computedNextPage)">
    <paginate-icon name="next"/>
  </item-button>
  <item-button
    v-if="showRangeDirection"
    :button-type="type"
    :title="`${computedNextRangePage} page`"
    :link="getUrl(computedNextRangePage)"
    :disabled="(current + pageRange) > pageCount"
    @click="onGotoPage(computedNextRangePage)">
    <paginate-icon name="range-next"/>
  </item-button>
  <item-button
    v-if="showEndDirection"
    :button-type="type"
    :title="`${pageCount} page`"
    :link="getUrl(pageCount)"
    :disabled="(current + pageRange) > pageCount"
    @click="onGotoPage(pageCount)">
    <paginate-icon name="end-next"/>
  </item-button>
</nav>
</template>

<script>
// original repo: https://github.com/lokyoung/vuejs-paginate
import * as text from '~/libs/text';

export default {
  props: {
    type: { type: String, default: null }, // nuxt-link,href,button
    current: { type: Number, default: 1 },
    url: { type: String, default: '' },
    params: { type: Object, default: null },
    total: { type: Number, required: true },
    size: { type: Number, required: true },
    forcePage: { type: Number },
    pageRange: { type: Number, default: 5 },
    marginPages: { type: Number, default: 1 },
    showDirection: { type: Boolean, default: false },
    showRangeDirection: { type: Boolean, default: true },
    showEndDirection: { type: Boolean, default: false },
  },
  components: {
    'paginate-icon': () => import('./paginate-icon'),
    'item-button': () => import('./item-button'),
  },
  model: {
    prop: 'current',
    event: 'change',
  },
  beforeUpdate() {
    if (this.forcePage === undefined) return;
    if (this.forcePage !== this.current) this.current = this.forcePage;
  },
  computed: {
    pageCount()
    {
      return Math.ceil(this.total / this.size);
    },
    computedPages()
    {
      let items = {};
      if (this.pageCount <= this.pageRange)
      {
        for (let index = 0; index < this.pageCount; index++)
        {
          items[index] = {
            index: index,
            content: index + 1,
            selected: index === (this.current - 1)
          };
        }
      }
      else
      {
        const halfPageRange = Math.floor(this.pageRange / 2);
        let setPageItem = index => {
          items[index] = {
            index: index,
            content: index + 1,
            selected: index === (this.current - 1)
          };
        };
        let setBreakView = index => {
          items[index] = {
            disabled: true,
            breakView: true
          };
        };
        // 1st - loop thru low end of margin pages
        for (let i = 0; i < this.marginPages; i++)
        {
          setPageItem(i);
        }
        // 2nd - loop thru selected range
        let selectedRangeLow = 0;
        if (this.current - halfPageRange > 0)
        {
          selectedRangeLow = this.current - 1 - halfPageRange;
        }
        let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
        if (selectedRangeHigh >= this.pageCount)
        {
          selectedRangeHigh = this.pageCount - 1;
          selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
        }
        for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount - 1; i++)
        {
          setPageItem(i);
        }
        // Check if there is breakView in the left of selected range
        if (selectedRangeLow > this.marginPages)
        {
          setBreakView(selectedRangeLow - 1)
        }
        // Check if there is breakView in the right of selected range
        if (selectedRangeHigh + 1 < this.pageCount - this.marginPages)
        {
          setBreakView(selectedRangeHigh + 1)
        }
        // 3rd - loop thru high end of margin pages
        for (let i = this.pageCount - 1; i >= this.pageCount - this.marginPages; i--)
        {
          setPageItem(i);
        }
      }
      return items
    },
    computedPrevRangePage()
    {
      let page = this.current - this.pageRange;
      return (page < 1) ? 1 : page;
    },
    computedPrevPage()
    {
      return this.current < 2 ? 1 : (this.current - 1);
    },
    computedNextPage()
    {
      return (this.current + 1) > this.pageCount ? this.pageCount : (this.current + 1);
    },
    computedNextRangePage()
    {
      let page = this.current + this.pageRange;
      return (page > this.pageCount) ? this.pageCount : page;
    },
  },
  methods: {
    onGotoPage(page)
    {
      if (this.current !== page)
      {
        this.$emit('change', page);
      }
    },
    getUrl(page)
    {
      let params = Object.assign({}, this.params);
      if (page === 1 && params.page)
      {
        delete params.page;
      }
      else if (page > 1)
      {
        params.page = page;
      }
      return `${this.url}${text.serialize(params, true)}`;
    },
  },
}
</script>

<style src="./index.scss" lang="scss" scoped/>
