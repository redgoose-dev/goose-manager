<template>
<div
  class="thumbnail"
  role="button"
  @click="emits('select-item', $event)">
  <Image
    :src="props.image"
    :name="props.name"
    :type="props.fileType"
    :size="size"
    :use-info="true"/>
  <ul v-if="props.badge?.length > 0" class="badge">
    <li v-for="o in props.badge">
      <Icon v-if="o === 'thumbnail'" name="image"/>
    </li>
  </ul>
  <nav class="context" @click.stop="">
    <button type="button">
      <Icon name="more-horizontal"/>
    </button>
    <ContextItems
      :items="context"
      @select="emits('select-context-item', $event)"/>
  </nav>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { getByte } from '../../../../libs/string'
import Icon from '../../../icons/index.vue'
import ContextItems from './context-items.vue'
import Image from './image.vue'

const props = defineProps({
  image: String,
  name: String,
  type: String,
  fileType: String,
  size: Number,
  badge: Array,
  context: Array,
})
const emits = defineEmits([ 'select-item', 'select-context-item' ])
const size = computed(() => getByte(props.size))
</script>

<style src="./theme-thumbnail.scss" lang="scss" scoped></style>
