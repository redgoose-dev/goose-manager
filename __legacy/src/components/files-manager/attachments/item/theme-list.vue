<template>
<div
  class="list"
  role="button"
  @click="emits('select-item', $event)">
  <Image
    :src="props.image"
    :name="props.name"
    :type="props.fileType"
    :size="size"
    :use-info="false"/>
  <div class="body">
    <h4 class="name">{{props.name}}</h4>
    <ul class="meta">
      <li>{{props.type}}</li>
      <li>{{getByte(props.size)}}</li>
    </ul>
    <ul v-if="props.badge?.length > 0" class="badges">
      <li v-for="o in props.badge">
        <Icon v-if="o === 'thumbnail'" name="image"/>
      </li>
    </ul>
  </div>
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
  name: String,
  type: String,
  fileType: String,
  size: Number,
  image: String,
  badge: Array,
  context: Array,
})
const emits = defineEmits([ 'select-item', 'select-context-item' ])
const size = computed(() => getByte(props.size))
</script>

<style src="./theme-list.scss" lang="scss" scoped></style>
