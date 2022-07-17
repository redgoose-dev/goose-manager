<template>
<div :class="[ 'attachment', props.selected && 'attachment--selected' ]">
  <button
    type="button"
    class="attachment__button"
    :title="props.name"
    @click="emits('select-item', $event)">
    <img v-if="type === 'image'" :src="props.image" alt="props.name" draggable="false"/>
    <span v-else>
      <Icon :name="fileType"/>
      <strong>{{props.name}}</strong>
      <em>{{getByte(props.size)}}</em>
    </span>
  </button>
  <ul v-if="props.badge?.length > 0" class="attachment__badges">
    <li v-for="o in props.badge">
      <Icon v-if="o === 'thumbnail'" name="image"/>
    </li>
  </ul>
  <div v-if="props.context?.length > 0" class="attachment__context">
    <button type="button">
      <Icon name="menu"/>
    </button>
    <ul>
      <template v-for="o in props.context">
        <li v-if="o === 'open-new-window'">
          <button type="button" @click="onClickContextItem(o)">
            새창으로 열기
          </button>
        </li>
        <li v-else-if="o === 'insert'">
          <button type="button" @click="onClickContextItem(o)">
            삽입하기
          </button>
        </li>
        <li v-else-if="o === 'insert-html'">
          <button type="button" @click="onClickContextItem(o)">
            HTML 삽입하기
          </button>
        </li>
        <li v-else-if="o === 'insert-address'">
          <button type="button" @click="onClickContextItem(o)">
            주소 삽입하기
          </button>
        </li>
        <li v-else-if="o === 'set-thumbnail' && localStore.useThumbnail">
          <button type="button" @click="onClickContextItem(o)">
            썸네일 이미지 설정
          </button>
        </li>
        <li v-else-if="o === 'delete'">
          <button type="button" class="color-error" @click="onClickContextItem(o)">
            삭제하기
          </button>
        </li>
      </template>
    </ul>
  </div>
</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { fileManagerStore } from '../store'
import { getByte } from '../../../libs/string'
import Icon from '../../icons/index.vue'

interface Props {
  image?: string
  name?: string
  type?: string
  size?: number
  context?: string[]
  badge?: string[]
  selected?: boolean
}

const props = defineProps<Props>()
const emits = defineEmits([ 'select-item', 'select-context-item' ])
const localStore = fileManagerStore()
const type = computed<string>(() => {
  if (!props.type) return ''
  const type = props.type.split('/')[0]
  switch (type)
  {
    case 'image':
      return 'image'
    default:
      return 'file'
  }
})
const fileType = computed<string>(() => {
  if (/^audio/.test(props.type || ''))
  {
    return 'music'
  }
  else if (/^video/.test(props.type || ''))
  {
    return 'video'
  }
  else if (/^text/.test(props.type || ''))
  {
    return 'file-text'
  }
  return 'file'
})

function onClickContextItem(key: string): any
{
  emits('select-context-item', key)
}
</script>

<style src="./item.scss" lang="scss" scoped></style>
