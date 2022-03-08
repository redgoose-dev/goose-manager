<template>
<div :class="[ 'attachment', props.selected && 'attachment--selected' ]">
  <button
    type="button"
    class="attachment__button"
    :title="props.name"
    @click="emits('select-item', $event)">
    <img v-if="type === 'image'" :src="props.image" alt="props.name">
    <span v-else>
      file
    </span>
  </button>
  <div class="attachment__context">
    <button type="button">
      <Icon name="menu"/>
    </button>
    <ul>
      <li>
        <button type="button">menu#1</button>
      </li>
      <li>
        <button type="button">menu#2</button>
      </li>
      <li>
        <button type="button">menu#3</button>
      </li>
    </ul>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue';
import Icon from '../icons/index.vue';

const props = defineProps({
  image: String, // image url path
  name: String,
  type: String,
  badge: Array,
  selected: Boolean,
});
const emits = defineEmits([ 'select-item', 'select-menu' ]);
const type = computed(() => {
  if (!props.type) return '';
  const type = props.type.split('/')[0];
  switch (type)
  {
    case 'image':
      return 'image';
    default:
      return 'file';
  }
});
</script>

<style src="./attachment.scss" lang="scss" scoped></style>
