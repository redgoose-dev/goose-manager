<template>
<nav class="paginate">
  <button
    v-if="showFirstLastButton"
    type="button"
    title="First page"
    :class="[ firstPageSelected() && 'disabled' ]"
    @click="selectFirstPage()">
    <i class="icon material-icons">first_page</i>
  </button>
  <button
    v-if="showPrevNext && !firstPageSelected()"
    type="button"
    title="Prev page"
    :class="[ firstPageSelected() && 'disabled' ]"
    @click="prevPage()">
    <i class="icon material-icons">chevron_left</i>
  </button>
  <template v-for="page in pages">
    <span v-if="page.breakView" class="dots">
      <i class="icon material-icons">more_horiz</i>
    </span>
    <span v-else-if="page.disabled" class="disabled">{{ page.content }}</span>
    <strong v-else-if="page.selected" :title="`${page.content} page`">{{ page.content }}</strong>
    <button
      v-else
      :title="`${page.content} page`"
      @click="handlePageSelected(page.index + 1)">
      {{ page.content }}
    </button>
  </template>
  <button
    v-if="showPrevNext && !lastPageSelected()"
    type="button"
    title="Next"
    :class="[ lastPageSelected() && 'disabled' ]"
    @click="nextPage()">
    <i class="icon material-icons">chevron_right</i>
  </button>
  <button
    v-if="showFirstLastButton"
    type="button"
    title="Last"
    :class="[ lastPageSelected() && 'disabled' ]"
    @click="selectLastPage()">
    <i class="icon material-icons">last_page</i>
  </button>
</nav>
</template>

<script>
// original repo: https://github.com/lokyoung/vuejs-paginate
export default {
  props: {
    value: { type: Number, default: 1 },
    url: { type: String, required: true },
    pageCount: { type: Number, required: true },
    forcePage: { type: Number },
    pageRange: { type: Number, default: 4 },
    marginPages: { type: Number, default: 1 },
    showFirstLastButton: { type: Boolean, default: true },
    showPrevNext: { type: Boolean, default: true },
  },
  beforeUpdate() {
    if (this.forcePage === undefined) return;
    if (this.forcePage !== this.selected) this.selected = this.forcePage;
  },
  computed: {
    selected()
    {
      return this.value;
    },
    pages()
    {
      let items = {};
      if (this.pageCount <= this.pageRange)
      {
        for (let index = 0; index < this.pageCount; index++)
        {
          items[index] = {
            index: index,
            content: index + 1,
            selected: index === (this.selected - 1)
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
            selected: index === (this.selected - 1)
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
        if (this.selected - halfPageRange > 0)
        {
          selectedRangeLow = this.selected - 1 - halfPageRange;
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
        if (selectedRangeLow > this.marginPages) {
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
    }
  },
  methods: {
    handlePageSelected(selected)
    {
      if (this.selected === selected) return;
      this.$emit('input', selected);
    },
    prevPage()
    {
      if (this.selected <= 1) return;
      this.$emit('input', this.selected - 1);
    },
    nextPage()
    {
      if (this.selected >= this.pageCount) return;
      this.$emit('input', this.selected + 1);
    },
    firstPageSelected()
    {
      return this.selected === 1;
    },
    lastPageSelected()
    {
      return (this.selected === this.pageCount) || (this.pageCount === 0);
    },
    selectFirstPage()
    {
      if (this.selected <= 1) return;
      this.$emit('input', 1);
    },
    selectLastPage()
    {
      if (this.selected >= this.pageCount) return;
      this.$emit('input', this.pageCount);
    },
  },
}
</script>

<style src="./paginate.scss" lang="scss" scoped/>
