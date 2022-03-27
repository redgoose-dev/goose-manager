<template>
  <icon v-if="name === 'dots'" name="more-horizontal"/>

  <icon v-else-if="name === 'prev'" name="chevron-left"/>
  <icon v-else-if="name === 'range-prev'" name="chevrons-left"/>
  <icon v-else-if="name === 'end-prev'" name="arrow-left"/>

  <icon v-else-if="name === 'next'" name="chevron-right"/>
  <icon v-else-if="name === 'range-next'" name="chevrons-right"/>
  <icon v-else-if="name === 'end-next'" name="arrow-right"/>
</template>

<script>
export default {
  name: 'paginate-icon',
  components: {
    'icon': () => import('~/components/icon'),
  },
  props: {
    name: { type: String, default: null }
  },
}
</script>
