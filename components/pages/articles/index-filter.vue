<template>
<form @submit.prevent="" class="index-filter">
  <form-select
    v-model="order"
    size="mini"
    :placeholder="null"
    :options="[
      { label: 'srl', value: 'srl' },
      { label: 'order', value: '`order`' },
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
</form>
</template>

<script>
export default {
  name: 'index-filter',
  components: {
    'form-select': () => import('~/components/form/select'),
  },
  data()
  {
    const { preference } = this.$store.state;
    return {
      order: preference.articles.filter.order,
      sort: preference.articles.filter.sort,
    };
  },
  methods: {
    update()
    {
      this.$emit('change', {
        order: this.order,
        sort: this.sort,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.index-filter {
  display: flex;
  align-items: center;
  > * {
    &:nth-child(n+2) {
      margin-left: 8px;
    }
  }
}
</style>
