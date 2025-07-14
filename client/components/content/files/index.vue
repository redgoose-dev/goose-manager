<template>
<article class="files">
  <ModalHeader :title="props.title" @close="emits('close')"/>
  <Loading v-if="state.loading"/>
  <div v-else-if="state.index?.length > 0" class="body">
    <p class="count">
      총 <strong>{{state.total}}</strong>개의 파일이 있습니다.
    </p>
    <Items v-if="_items.length > 0" theme="thumbnail" class="index">
      <Thumbnail
        v-for="o in _items"
        :href="o.href"
        target="_blank"
        :image="o.image"
        :icon="o.icon"
        thumbnail-type="contain"
        :title="o.title"
        :meta="o.meta"
        :private="props.private"/>
    </Items>
  </div>
  <Empty
    v-else
    title="No data"
    message="첨부파일이 없습니다."/>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, inject } from 'vue'
import { request } from '../../../libs/api.js'
import { getFilePath } from '../../../libs/file.js'
import { dateFormat } from '../../../libs/date.js'
import { getByte } from '../../../libs/strings.js'
import { addQueryParams } from '../../../libs/object.js'
import { Loading, Empty } from '../index.js'
import { Items, Thumbnail } from '../../item/index.js'
import { ModalHeader } from '../../modal/index.js'

const props = defineProps({
  title: { type: String, default: '첨부파일' },
  module: String,
  moduleSrl: Number,
  private: Boolean,
})
const emits = defineEmits([ 'close' ])
const auth = inject('auth')
const error = inject('error')
const errorPath = [ 'components', 'content', 'files', 'index.vue' ]
const state = reactive({
  loading: true,
  total: 0,
  index: [],
})

const _items = computed(() => {
  if (!(state.index.length > 0)) return []
  return state.index.map(o => {
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
      href: props.private ? addQueryParams(`${auth.apiUrl}${path}`, '_a', auth.token) : `${auth.apiUrl}${path}`,
      image,
      icon,
      meta: [
        dateFormat(new Date(o.created_at), '{yyyy}-{MM}-{dd}'),
        o.mime.split('/')[0],
        getByte(o.size),
      ],
    }
  })
})

onMounted(async () => {
  try
  {
    if (!(props.module && props.moduleSrl))
    {
      throw new Error('module, moduleSrl 값이 없습니다.')
    }
    const res = await request('/file/', {
      query: {
        module: props.module,
        module_srl: props.moduleSrl,
        unlimited: '1',
      },
    })
    if (!res?.data) throw new Error('파일 데이터가 없습니다.')
    state.total = res.data.total
    state.index = res.data.index?.length > 0 ? res.data.index : []
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '파일 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
