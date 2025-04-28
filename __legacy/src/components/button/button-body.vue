<template>
<span class="button-body">
  <Icon
    v-if="props.iconLeft"
    :name="props.iconLeft"
    class="button-body__icon"/>
  <em
    v-if="$slots.default"
    class="button-body__label">
    <slot/>
  </em>
  <Icon
    v-if="props.iconRight"
    :name="props.iconRight"
    class="button-body__icon"/>
</span>
</template>

<script setup>
import Icon from '../icons/index.vue'

const props = defineProps({
  iconLeft: String,
  iconRight: String,
  rotateIcon: Boolean,
})
</script>

<style src="./button-body.scss" lang="scss" scoped></style>
