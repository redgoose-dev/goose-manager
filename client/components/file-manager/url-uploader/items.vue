<template>
<ul class="items">
  <li v-for="(item,idx) in _items" class="item">
    <Image
      role="button"
      :src="item.src"
      class="item__image"
      @click="onClickImage(idx)"/>
    <div class="item__body">
      <FormInput
        :model-value="item.name"
        size="small"
        @update:model-value="value => onUpdateFilename(idx, value)"/>
      <p>
        <span>{{item.type}}</span>
        <span>{{item.size}}</span>
      </p>
    </div>
    <nav class="item__control">
      <ButtonIcon
        icon-name="minimize-2"
        color="transparent"
        :disabled="processingMinify !== undefined"
        class="minify"
        @click="onClickMinifySize(idx)"/>
      <ButtonIcon
        icon-name="trash-2"
        color="transparent"
        :disabled="processingMinify !== undefined"
        class="remove"
        @click="onClickRemoveItem(idx)"/>
    </nav>
    <transition name="fade">
      <i
        v-if="idx === processingMinify"
        class="processing-overlay">
        <Icon name="loader" animation="spin"/>
      </i>
    </transition>
  </li>
</ul>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import imageResize from 'image-resize'
import { getByte } from '../../../libs/strings.js'
import { loadImage } from '../../../libs/file.js'
import Image from '../../content/image.vue'
import { ButtonIcon } from '../../button/index.js'
import { FormInput } from '../../forms/index.js'
import Icon from '../../icon/index.vue'

const toast = inject('toast')
const error = inject('error')
const props = defineProps({
  items: Array,
})
const emits = defineEmits([ 'update-item', 'remove-item' ])
const processingMinify = ref(undefined)

const _items = computed(() => {
  return props.items.map((o,k) => {
    return {
      src: URL.createObjectURL(o.blob),
      name: o.name,
      size: getByte(o.blob.size),
      type: o.blob.type,
    }
  })
})

function onClickImage(idx)
{
  const item = props.items[idx]
  if (!item) return
  const uri = URL.createObjectURL(item.blob)
  window.open(uri)
  setTimeout(() => URL.revokeObjectURL(uri), 100)
}

async function onClickMinifySize(idx)
{
  if (processingMinify.value !== undefined) return
  try
  {
    processingMinify.value = idx
    const item = props.items[idx]
    if (!item) throw new Error('no item')
    const format = 'webp'
    const uri = URL.createObjectURL(item.blob)
    const image = await loadImage(uri)
    const size = image.naturalWidth > image.naturalHeight ? {
      width: Math.min(image.naturalWidth, 4200),
    } : {
      height: Math.min(image.naturalHeight, 4200),
    }
    const output = await imageResize(item.blob, {
      format,
      outputType: 'blob',
      quality: .95,
      ...size,
      reSample: 1,
      sharpen: 0,
    })
    emits('update-item', idx, {
      blob: output,
      date: item.date,
      name: item.name.replace(/\.[^/.]+$/, `.${format}`),
    })
    toast.add('파일 변환을 완료했습니다.', 'success').then()
  }
  catch (e)
  {
    error.catch({
      path: [ 'components', 'file-manager', 'url-uploader', 'items.vue', 'onClickMinifySize()' ],
      message: '파일 변환에 실패했습니다.',
      error: e,
    })
  }
  finally
  {
    processingMinify.value = undefined
  }
}

function onClickRemoveItem(idx)
{
  emits('remove-item', idx)
}

function onUpdateFilename(idx, value)
{
  if (props.items[idx].name === value) return
  emits('update-item', idx, {
    ...props.items[idx],
    name: value,
  })
}
</script>

<style src="./items.scss" lang="scss" scoped></style>
