<template>
<div class="form-search">
  <input
    type="text"
    name="keyword"
    v-model="keyword"
    size="10"
    maxlength="20"
    placeholder="keyword"
    class="form-search__keyword"
    @keydown.enter="onSubmit"/>
  <button
    type="button"
    :disabled="computedClearDisabled"
    class="form-search__clear"
    @click="onClear">
    <icon name="x-circle"/>
  </button>
  <button
    type="button"
    :disabled="processing"
    class="form-search__submit"
    @click="onSubmit">
    <icon name="search"/>
    <icon name="loader"/>
  </button>
</div>
</template>

<script>
export default {
  name: 'form-search',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    processing: { type: Boolean, default: false },
    init: { type: Object },
  },
  data()
  {
    return {
      keyword: this.init.keyword,
    };
  },
  computed: {
    computedClearDisabled()
    {
      return !(this.keyword.length > 0);
    },
  },
  methods: {
    onSubmit(e)
    {
      this.$emit('submit', this.keyword);
    },
    onClear()
    {
      this.keyword = '';
    },
  },
}
</script>

<style src="./form-search.scss" lang="scss" scoped/>
