<template>
<div :class="[
  'toolbar-item',
  props.type === 'dropdown' && 'dropdown',
]">
  <button
    type="button"
    :title="props.title"
    :class="[
      'toolbar-item__button',
      props.color && `color--${props.color}`,
    ]"
    @click="emits('click')">
    <span v-if="props.label">
      <Icon :name="props.icon"/>
      <em>{{props.label}}</em>
    </span>
    <Icon v-else :name="props.icon"/>
  </button>
  <div v-if="props.context?.length > 0" class="toolbar-item__children">
    <ul :class="[ props.contextAlign && props.contextAlign ]">
      <li v-for="o in props.context">
        <router-link v-if="o.to" :to="o.to">{{o.label}}</router-link>
        <a v-else-if="o.href" :href="o.href" :target="o.target">{{o.label}}</a>
        <button v-else type="button" @click="o.click">{{o.label}}</button>
      </li>
    </ul>
  </div>
</div>
</template>

<script setup>
import Icon from '../../icons/index.vue';

const props = defineProps({
  type: { type: String, default: 'button' }, // button,dropdown
  title: { type: String, required: true },
  label: String,
  icon: { type: String, required: true },
  color: String,
  context: Array,
  contextAlign: String,
});
const emits = defineEmits([ 'click' ]);
</script>

<style src="./item.scss" lang="scss" scoped></style>
