<template>
<nav class="context">
  <slot name="before"/>
  <ul v-if="props.items.length > 0">
    <li v-for="item in props.items">
      <hr v-if="item.line">
      <button
        v-else
        type="button"
        :disabled="item.disabled"
        :class="[
          item.color && `color--${item.color}`,
          item.fill && `fill--${item.fill}`,
        ]"
        @click="onClickItem(item)">
        <span>
          <Icon v-if="item.iconLeft" :name="item.iconLeft"/>
          <em>{{item.label}}</em>
          <Icon v-if="item.iconRight" :name="item.iconRight"/>
        </span>
      </button>
    </li>
  </ul>
  <slot name="after"/>
</nav>
</template>

<script setup>
import Icon from '../../icon/index.vue'

const props = defineProps({
  items: { type: Array, required: true }, // { label, icon, color, fill, disabled }
})
const emits = defineEmits([ 'select' ])

function onClickItem(item)
{
  emits('select', item)
}
</script>

<style src="./context.scss" lang="scss" scoped></style>
