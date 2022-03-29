<template>
<p class="metas">
  <span v-for="(meta,key) in items" v-if="meta" class="metas__item">{{meta}}</span>
</p>
</template>

<script>
export default {
  name: 'metas',
  props: {
    items: { type: Array, default: [] },
  },
}
</script>

<style src="./metas.scss" lang="scss" scoped/>
