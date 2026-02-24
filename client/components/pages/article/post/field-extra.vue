<template>
<dl class="extra">
  <Item
    v-for="(item,key) in props.resource"
    v-model:value="model[item.name]"
    :resource="item"
    :idx="key"/>
</dl>
</template>

<script setup>
import Item from './field-extra-item.vue'

const props = defineProps({
  resource: Object,
})
const model = defineModel()
</script>

<style lang="scss" scoped>
@use '../../../../scss/mixins';
.extra {
  margin: 0;
  padding-block: 8px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px 16px;
}
</style>
