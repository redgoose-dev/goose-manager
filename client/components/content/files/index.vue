<template>
<article class="files">
  <ModalHeader :title="props.title" @close="emits('close')"/>
  <div class="body">
    <p class="count">
      총 <strong>{{props.items.length || 0}}</strong>개의 파일이 있습니다.
    </p>
    <Items v-if="_items.length > 0" theme="thumbnail" class="index">
      <Thumbnail
        v-for="o in _items"
        :href="o.href"
        :image="o.image"
        :icon="o.icon"
        thumbnail-type="contain"
        :title="o.title"
        :meta="o.meta"
        :use-button="true"
        @click:body="onClickItem"/>
    </Items>
    <Empty
      v-else
      title="No data"
      message="첨부파일이 없습니다."/>
  </div>
</article>
</template>

<script setup>
import { computed } from 'vue'
import { authStore } from '../../../store/auth.js'
import { getResizePath } from '../../../libs/file.js'
import { getDate } from '../../../libs/date.js'
import { getByte } from '../../../libs/strings.js'
import { Empty } from '../index.js'
import { Items, Thumbnail } from '../../item/index.js'
import { ModalHeader } from '../../modal/index.js'

const auth = authStore()
const props = defineProps({
  title: { type: String, default: '첨부파일' },
  items: Array,
  private: Boolean,
})
const emits = defineEmits([ 'close' ])

const _items = computed(() => {
  if (!(props.items?.length > 0)) return []
  return props.items.map(o => {
    let image, icon
    const path = getResizePath(o.code, '', auth.apiUrl)
    if (/^image/.test(o.mime))
    {
      image = `${path}?w=640&h=480&q=65`
    }
    else if (o.mime === 'application/pdf')
    {
      icon = 'file-text'
    }
    else
    {
      icon = 'file'
    }
    return {
      srl: o.srl,
      title: o.name,
      href: path,
      image,
      icon,
      meta: [
        `날짜: ${getDate(o.created_at)}`,
        `타입: ${o.mime.split('/')[0]}`,
        `사이즈: ${getByte(o.size)}`,
      ],
    }
  })
})

function onClickItem(href, e)
{
  window.open(href, '_blank')
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
