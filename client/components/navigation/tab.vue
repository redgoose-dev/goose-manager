<template>
<nav class="tab">
  <template v-for="o in props.items">
    <router-link
      v-if="o.link"
      :to="o.link">
      <Icon v-if="o.icon" :name="o.icon"/>
      <span>{{o.label}}</span>
    </router-link>
    <button
      v-else
      type="button"
      :disabled="o.key === props.active"
      @click="emits('update:active', o.key)">
      <Icon v-if="o.icon" :name="o.icon"/>
      <span>{{o.label}}</span>
    </button>
  </template>
</nav>
</template>

<script setup>
import Icon from '../icon/index.vue'

const props = defineProps({
  items: Array, // { key, label, link, icon }
  active: String,
})
const emits = defineEmits([ 'update:active' ])
</script>

<style src="./tab.scss" lang="scss" scoped></style>
