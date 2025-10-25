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
    :private="fileManager.preference.private"
    :draggable="false"
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
  <div v-if="_context.length > 0" class="file__context" @click.stop>
    <Dropdown mode="hover" position="right">
      <template #trigger>
        <ButtonIcon type="label" icon-name="ellipsis"/>
      </template>
      <Context :items="_context" @select="onSelectContextItem"/>
    </Dropdown>
  </div>
</div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { getFilePath } from '../../../libs/file.js'
import { fileContextKey } from '../assets.js'
import { Image } from '../../content/index.js'
import { Dropdown, Context } from '../../navigation/dropdown/index.js'
import { ButtonIcon } from '../../button/index.js'
import Icon from '../../icon/index.vue'

const props = defineProps({
  idx: Number,
  srl: Number,
  name: String,
  mime: String,
  selected: Boolean,
  badge: Array,
})
const emits = defineEmits([ 'select', 'select-context-item' ])
const auth = inject('auth')
const fileManager = inject('file-manager')

const _src = computed(() => {
  const type = props.mime.split('/')[0]
  return getFilePath(props.srl, {
    query: type === 'image' ? { w: 300, h: 300, q: 65 } : undefined,
  })
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
    default:
      return 'file'
  }
})
const _context = computed(() => {
  const useNewWindow = checkUseNewWindow()
  const useEditThumbnail = checkUseEditThumbnail()
  return [
    useNewWindow && { key: fileContextKey.OPEN_NEW_WINDOW, label: '새창으로 열기', iconRight: 'external-link' },
    { key: fileContextKey.DOWNLOAD, label: '파일 다운로드', iconRight: 'download' },
    useEditThumbnail && { key: fileContextKey.SET_THUMBNAIL, label: '썸네일 이미지 설정', iconRight: 'crop', color: 'sub' },
    { line: true },
    { key: fileContextKey.INSERT_MARKDOWN, label: '마크다운 코드삽입', iconRight: 'file-down' },
    { key: fileContextKey.INSERT_ADDRESS, label: '주소 삽입하기', iconRight: 'link' },
    { key: fileContextKey.INSERT_HTML, label: 'HTML 삽입하기', iconRight: 'code-xml' },
    { line: true },
    { key: fileContextKey.DELETE, label: '삭제하기', iconRight: 'trash-2', color: 'error' },
  ].filter(Boolean)
})

function onSelectContextItem({ key })
{
  emits('select-context-item', props.idx, key)
}

function checkUseNewWindow()
{
  const type = props.mime.split('/')[0]
  const allow = [ 'image', 'video', 'audio', 'text', 'application' ]
  return allow.includes(type)
}
function checkUseEditThumbnail()
{
  if (!fileManager.preference.useThumbnail) return false
  if (!/^image\//.test(props.mime) && !props.badge.includes('thumbnail')) return false
  return true
}
</script>

<style src="./file.scss" lang="scss" scoped></style>
