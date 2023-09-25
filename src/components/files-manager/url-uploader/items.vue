<template>
<ul v-if="items.length > 0" class="verify-items">
  <li
    v-for="(o,k) in items"
    class="verify-item">
    <figure class="verify-item__asset">
      <a :href="o.src" target="_blank">
        <img
          v-if="o.typeName === 'image'"
          :src="o.src"
          :alt="o.name"
          loading="lazy"/>
        <span v-else title="o.name">
          <Icons name="file"/>
        </span>
      </a>
    </figure>
    <div class="verify-item__body">
      <ContentEditable
        tag="h4"
        :model-value="o.name"
        placeholder="filename.jpg"
        @update:modelValue="onEditFilename(k, $event)"/>
      <p>
        <span>{{o.type}}</span>
        <span>{{o.size}}</span>
      </p>
    </div>
    <nav class="verify-item__nav">
      <button
        v-if="o.typeName === 'image' && o.type !== 'image/webp'"
        type="button"
        title="WebP로 변환"
        @click="onClickChangeFormat(k)">
        <Icons name="minimize-2"/>
      </button>
      <button type="button" title="삭제" @click="onClickRemoveItem(k)">
        <Icons name="trash-2"/>
      </button>
    </nav>
  </li>
</ul>
<div v-else class="verify-empty">
  <p>등록된 파일이 없습니다.</p>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageResize from 'image-resize'
import { getByte, printf } from '../../../libs/string'
import { loadImage } from '../../../libs/util'
import { toast } from '../../../modules/toast'
import { err } from '../../../libs/error'
import Icons from '../../icons/index.vue'
import { ContentEditable } from '../../forms'

const props = defineProps({
  src: Array
})
const emits = defineEmits([ 'remove-item', 'update-item' ])
const items = computed(() => {
  if (!(props.src.length > 0)) return []
  return props.src.map(o => {
    return {
      src: URL.createObjectURL(o.blob),
      name: o.name,
      size: getByte(o.blob.size),
      type: o.type,
      typeName: o.type.split('/')[0],
    }
  })
})

function onClickRemoveItem(idx)
{
  emits('remove-item', idx)
}

async function onClickChangeFormat(idx)
{
  try
  {
    const format = 'webp'
    const image = await loadImage(window.URL.createObjectURL(props.src[idx].blob))
    const size = image.naturalWidth > image.naturalHeight ? {
      width: Math.min(image.naturalWidth, 4200),
    } : {
      height: Math.min(image.naturalHeight, 4200),
    }
    const resize = new ImageResize({
      format,
      outputType: 'blob',
      quality: .90,
      ...size,
      reSample: 1,
      sharpen: 0,
    })
    let output = await resize.play(props.src[idx].blob)
    emits('update-item', idx, {
      blob: output,
      date: props.src[idx].date,
      name: props.src[idx].name.replace(/\.[^/.]+$/, `.${format}`),
      type: output.type,
    })
    toast.add('파일변환을 성공했습니다.', 'success').then()
  }
  catch (e)
  {
    err(['/components/files-manager/url-uploader/items.vue', 'onClickChangeFormat()'], 'error', e.message)
    toast.add('파일변환을 실패했습니다.', 'error').then()
  }
}

function onEditFilename(key, value)
{
  if (items.value[key].name === value) return
  emits('update-item', key, {
    ...props.src[key],
    name: value,
  })
}
</script>

<style src="./items.scss" lang="scss" scoped></style>
