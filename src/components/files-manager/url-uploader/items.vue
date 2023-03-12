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
      <h4>{{o.name}}</h4>
      <p>
        <span>{{o.type}}</span>
        <span>{{o.size}}</span>
      </p>
    </div>
    <nav class="verify-item__nav">
      <button
        v-if="o.typeName === 'image' && o.type !== 'image/webp'"
        type="button"
        :title="printf(message.words.convert, 'WebP')"
        @click="onClickChangeFormat(k)">
        <Icons name="minimize-2"/>
      </button>
      <button
        type="button"
        :title="message.word.delete"
        @click="onClickRemoveItem(k)">
        <Icons name="trash-2"/>
      </button>
    </nav>
  </li>
</ul>
<div v-else class="verify-empty">
  <p>{{message.words.noFiles}}</p>
</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import ImageResize from 'image-resize'
import { getByte, printf } from '../../../libs/string'
import { loadImage } from '../../../libs/util'
import type { VerifyItem } from './types'
import { message } from '../../../message'
import { toast } from '../../../modules/toast'
import { err } from '../../../libs/error'
import Icons from '../../icons/index.vue'

const props = defineProps<{
  src: VerifyItem[]
}>()
const emits = defineEmits([ 'remove-item', 'update-item' ])
const checks = ref<{ [key: number]: boolean }>((() => {
  let checks: { [key: number]: boolean } = {}
  if (props.src.length > 0)
  {
    for (let i: number = 0; i < props.src.length; i++)
    {
      checks[i] = true
    }
  }
  return checks
})())
const items = computed<any[]>(() => {
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

function onClickRemoveItem(idx: number): void
{
  emits('remove-item', idx)
}

async function onClickChangeFormat(idx: number): Promise<void>
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
    let output: any = await resize.play(props.src[idx].blob)
    emits('update-item', idx, {
      blob: output,
      date: props.src[idx].date,
      name: props.src[idx].name.replace(/\.[^/.]+$/, `.${format}`),
      type: output.type,
    })
    toast.add(message.success.convertFile, 'success').then()
  }
  catch (e: any)
  {
    err(['/components/files-manager/url-uploader/items.vue', 'onClickChangeFormat()'], 'error', e.message)
    toast.add(message.fail.convertFile, 'error').then()
  }
}
</script>

<style src="./items.scss" lang="scss" scoped></style>
