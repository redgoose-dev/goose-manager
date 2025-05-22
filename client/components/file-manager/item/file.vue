<template>
<div
  role="button"
  :class="[
    'file',
    selected && 'file--selected',
  ]"
  @click="emits('select', props.idx, $event)">
  <Image
    v-if="_isImage"
    :src="_src"
    :alt="props.name"
    :use-fetch="true"
    class="file__image"/>
  <p v-else class="file__raw">
    <Icon :name="_fileIcon"/>
    <span>{{props.name}}</span>
  </p>
  <ul v-if="props.badge?.length > 0" class="file__badge">
    <li v-for="o in props.badge">
      <Icon v-if="o === 'thumbnail'" name="image"/>
    </li>
  </ul>
  <div v-if="props.context.length > 0" class="file__context" @click.stop>
    <Dropdown mode="hover" position="right">
      <template #trigger>
        <ButtonIcon type="label" icon-name="menu">
          트리거 버튼
        </ButtonIcon>
      </template>
      <Context
        :items="[
          { key: 'context-1', label: 'context #0', iconRight: 'star' },
          { key: 'context-1', label: 'context #1', iconLeft: 'link', iconRight: 'link', color: 'key' },
          { key: 'context-2', label: 'context #2', iconLeft: 'cloud', iconRight: 'cloud' },
          { key: 'context-3', label: 'context #3', iconLeft: 'droplet', iconRight: 'droplet' },
        ]"
        @select=""/>
    </Dropdown>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { authStore } from '../../../store/auth.js'
import Image from '../../content/image.vue'
import { Dropdown, Context } from '../../navigation/dropdown/index.js'
import { ButtonIcon } from '../../button/index.js'
import Icon from '../../icon/index.vue'

const auth = authStore()
const props = defineProps({
  idx: Number,
  srl: Number,
  name: String,
  mime: String,
  selected: Boolean,
  badge: Array,
  context: Array,
})
console.log('file)', props)
const emits = defineEmits([ 'select' ])

const _src = computed(() => {
  const type = props.mime.split('/')[0]
  switch (type)
  {
    case 'image':
      return `${auth.apiUrl}/file/${props.srl}/?w=300&h=300&q=65`
    default:
      return `${auth.apiUrl}/file/${props.srl}/`
  }
})
const _isImage = computed(() => {
  return /^image/.test(props.mime || '')
})
const _fileIcon = computed(() => {
  const type = props.mime.split('/')[0]
  switch (type)
  {
    case 'image':
      return 'file-image'
    case 'application':
      return 'file'
    case 'text':
      return 'file-text'
    case 'audio':
      return 'file-audio'
    case 'video':
      return 'file-video'
  }
})
</script>

<style src="./file.scss" lang="scss" scoped></style>
