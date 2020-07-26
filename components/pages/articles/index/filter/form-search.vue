<template>
<div class="form-search">
  <p class="form-search__keyword">
    <input
      type="text"
      :name="name"
      :id="id"
      v-model="keyword"
      size="10"
      maxlength="20"
      placeholder="keyword"
      @keydown.enter="onSubmit"/>
  </p>
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
    id: { type: String, default: null },
    name: { type: String, default: null },
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
