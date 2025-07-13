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
        :private="props.private"
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
import { computed, inject } from 'vue'
import { request } from '../../../libs/api.js'
import { getFilePath } from '../../../libs/file.js'
import { getDate } from '../../../libs/date.js'
import { getByte } from '../../../libs/strings.js'
import { Empty } from '../index.js'
import { Items, Thumbnail } from '../../item/index.js'
import { ModalHeader } from '../../modal/index.js'

// TODO: 이 컴포넌트 상당히 고쳐야 한다.
// TODO: module, moduleSrl 값을 props로 받아서 api 요청하기
// TODO: 컴포넌트가 고쳐지면 사용된 컴포넌트 부분 같이 고쳐줘야 한다.

const props = defineProps({
  title: { type: String, default: '첨부파일' },
  items: Array,
  private: Boolean,
})
const emits = defineEmits([ 'close' ])
const auth = inject('auth')
const error = inject('error')
const errorPath = [ 'components', 'content', 'files', 'index.vue' ]

const _items = computed(() => {
  if (!(props.items?.length > 0)) return []
  return props.items.map(o => {
    let image, icon
    const path = getFilePath(o.code)
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

async function onClickItem(href, e)
{
  try
  {
    const res = await request(href, {})
    if (!res) throw new Error('파일을 가져오지 못했습니다.')
    if (!(res instanceof Blob)) throw new Error('파일 데이터가 아닙니다.')
    const uri = URL.createObjectURL(res)
    window.open(uri)
  }
  catch (_e)
  {
    error.catch({
      path: [ ...errorPath, 'onClickItem()' ],
      message: '파일을 열지 못했습니다.',
      error: _e,
    })
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
