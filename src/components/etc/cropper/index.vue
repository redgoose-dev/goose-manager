<template>
<div ref="$root" class="cropper"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Croppie from 'croppie'
import imageResize from 'image-resize'
import { pureObject } from '../../../libs/object'
import { err } from '../../../libs/error'
import 'croppie/croppie.css'

const $root = ref()
const props = defineProps({
  image: String,
  boundary: Object,
  viewport: Object,
  modelValue: Object,
})
const emits = defineEmits([ 'update:modelValue' ])
let croppie

function onSubmit(data)
{
  emits('update:modelValue', data)
}

async function output()
{
  const width = props.viewport.width || 320
  const height = props.viewport.height || 240
  let output = await croppie.result({
    type: 'base64',
    format: 'png',
    size: { width: width * 2, height: height * 2 },
  })
  output = imageResize(output, {
    format: 'webp',
    outputType: 'base64',
    quality: .9,
    width,
    height,
    reSample: 4,
    sharpen: .25,
  })
  return output
}

watch(() => props.image, image => croppie.bind({
  url: image,
  points: props.modelValue.points,
  zoom: props.modelValue.zoom,
}))

onMounted(() => {
  try
  {
    croppie = new Croppie($root.value, pureObject({
      boundary: props.boundary || { width: '100%', height: '100%' },
      viewport: props.viewport || { width: 320, height: 240, type: 'square' },
    }))
    croppie.bind(pureObject({
      url: props.image,
      points: props.modelValue.points || undefined,
      zoom: props.modelValue.zoom || undefined,
      orientation: props.modelValue.orientation || undefined,
    }))
    // croppie
    setTimeout(() => {
      $root.value.addEventListener('update', e => onSubmit(e.detail))
    }, 200)
  }
  catch (e)
  {
    err(['/components/etc/cropper/index.vue', 'onMounted()'], 'error', e.message)
  }
})
onUnmounted(() => {
  if (!croppie) return
  croppie.destroy()
  croppie = undefined
})

defineExpose({
  output,
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
