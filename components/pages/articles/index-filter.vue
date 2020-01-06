<template>
<form @submit.prevent="">
  <form-select
    v-model="order"
    size="mini"
    :placeholder="null"
    :options="[
      { label: 'srl', value: 'srl' },
      { label: 'order', value: '`order`' },
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
    };
  },
  methods: {
    update()
    {
      this.$emit('change', {
        order: this.order,
      })
    },
  },
}
</script>
