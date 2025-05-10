<template>
<nav class="context">
  <ul>
    <li v-for="item in props.items">
      <button
        type="button"
        :class="[
          item.color && `color--${item.color}`,
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
</nav>
</template>

<script setup>
import Icon from '../../icon/index.vue'

const props = defineProps({
  items: { type: Array, required: true }, // { label, icon, color }
})
const emits = defineEmits([ 'select' ])

function onClickItem(item)
{
  emits('select', item)
}
</script>

<style src="./context.scss" lang="scss" scoped></style>
