<template>
<div class="files">
  <p class="total">총 <strong>{{props.total}}</strong>개의 파일이 등록되어 있습니다.</p>
  <Items theme="thumbnail" class="index">
    <Thumbnail
      v-for="o in props.items"
      :image="o.thumbnail"
      :icon="o.icon"
      thumbnail-type="contain"
      :title="o.title"
      :href="o.href"
      :meta="o.meta"
      :nav="o.nav"
      :use-button="true"
      :private="true"
      @click:body="onClickItem"/>
  </Items>
</div>
</template>

<script setup>
import { inject } from 'vue'
import { request } from '../../../libs/api.js'
import { Items, Thumbnail } from '../../item/index.js'

const error = inject('error')
const props = defineProps({
  total: Number,
  items: Array,
})
const errorPath = [ 'components', 'pages', 'file', 'files.vue' ]

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

<style src="./files.scss" lang="scss" scoped></style>
