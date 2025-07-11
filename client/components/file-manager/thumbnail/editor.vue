<template>
<article class="thumbnail-editor">
  <header class="thumbnail-editor__header">
    <h1>썸네일 이미지 만들기</h1>
    <p>영역을 설정하여 이미지를 자릅니다.</p>
  </header>
  <div class="thumbnail-editor__body">
    <Cropper
      ref="$cropper"
      :src="_src"
      :stencil-size="stencilSize"
      :stencil-props="{
        aspectRatio: _ratio,
        lines: {},
        handlers: {},
        movable: false,
        resizable: false,
      }"
      :default-size="defaultSize"
      image-restriction="stencil"
      :debounce="100"
      :auto-zoom="true"
      :transitions="false"
      :resize-image="{
        adjustStencil: false,
        wheel: { ratio: .05 },
      }"
      class="cropper"
      @ready="onReady"
      @change="onChange"/>
  </div>
  <nav class="thumbnail-editor__bottom">
    <div class="zoom">
      <i><Icon name="zoom-out"/></i>
      <p>
        <input
          type="range"
          :value="state.zoom"
          :min="0"
          :max=".75"
          :step="0.01"
          @input="onChangeZoom">
      </p>
      <i><Icon name="zoom-in"/></i>
    </div>
    <div class="submit">
      <ButtonGroup>
        <ButtonBasic icon-left="x" @click="emits('close')">
          닫기
        </ButtonBasic>
        <ButtonBasic icon-left="check" color="key" @click="onSubmit">
          썸네일 만들기
        </ButtonBasic>
      </ButtonGroup>
    </div>
  </nav>
  <ButtonIcon
    icon-name="x"
    color="transparent"
    @click="emits('close')"/>
</article>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, inject } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import imageResize from 'image-resize'
import { addQueryParams } from '../../../libs/object.js'
import { createRandomText } from '../../../libs/strings.js'
import { blobToFile } from '../../../libs/file.js'
import { ButtonGroup, ButtonBasic, ButtonIcon } from '../../button/index.js'
import Icon from '../../icon/index.vue'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps({
  src: String,
  cropSize: { type: Array, default: [ 640, 480 ] },
  private: Boolean,
  options: Object,
})
const emits = defineEmits([ 'close', 'submit' ])
const auth = inject('auth')
const $cropper = ref()
const state = reactive({
  zoom: 0,
})

const _src = computed(() => {
  if (!props.src) return ''
  if (/^blob:/.test(props.src)) return props.src
  if (props.src.startsWith('/file/'))
  {
    if (props.private) return addQueryParams(`${auth.apiUrl}${props.src}`, '_a', auth.token)
    else return `${auth.apiUrl}${props.src}`
  }
  return props.src
})
const _ratio = computed(() => {
  if (props.cropSize?.length === 2) return props.cropSize[0] / props.cropSize[1]
  return 1
})

function stencilSize({ boundaries })
{
  return {
    width: Math.min(boundaries.height, boundaries.width) - 48,
    height: Math.min(boundaries.height, boundaries.width) - 48,
  }
}
function defaultSize({ imageSize })
{
  return {
    width: Math.min(imageSize.height, imageSize.width),
    height: Math.min(imageSize.height, imageSize.width),
  }
}

function getCropperZoom()
{
  const cropper = $cropper.value
  const { coordinates, imageSize } = cropper
  if (imageSize.width / imageSize.height > coordinates.width / coordinates.height)
  {
    return (cropper.imageSize.height - cropper.coordinates.height) / (cropper.imageSize.height - cropper.sizeRestrictions.minHeight)
  }
  else
  {
    return (cropper.imageSize.width - cropper.coordinates.width) / (cropper.imageSize.width - cropper.sizeRestrictions.minWidth)
  }
}

function onReady()
{
  if (props.options?.coordinates)
  {
    $cropper.value.setCoordinates({
      ...props.options.coordinates,
    })
  }
  state.zoom = getCropperZoom()
}
function onChange()
{
  if (!$cropper.value) return
  state.zoom = getCropperZoom()
}

function onChangeZoom(e)
{
  const cropper = $cropper.value
  if (!cropper) return
  const value = Number(e.target.value)
  let z
  if (cropper.imageSize.height < cropper.imageSize.width)
  {
    const minHeight = cropper.sizeRestrictions.minHeight
    const imageHeight = cropper.imageSize.height
    z = (imageHeight - state.zoom * (imageHeight - minHeight)) / (imageHeight - value * (imageHeight - minHeight))
  }
  else
  {
    const minWidth = cropper.sizeRestrictions.minWidth
    const imageWidth = cropper.imageSize.width
    z = (imageWidth - state.zoom * (imageWidth - minWidth)) / (imageWidth - value * (imageWidth - minWidth))
  }
  cropper.zoom(z)
  state.zoom = value
}

async function onSubmit()
{
  const result = $cropper.value?.getResult()
  if (!result) return
  const { coordinates, canvas } = result
  const blob = await imageResize(canvas, {
    format: 'webp',
    quality: .70,
    width: props.cropSize[0],
    height: props.cropSize[1],
    outputType: 'blob',
    reSample: 2,
    sharpen: .75,
    bgColor: '#ffffff',
  })
  const file = blobToFile(blob, `${Date.now()}-${createRandomText(4)}.webp`, {
    type: 'image/webp',
  })
  emits('submit', {
    coordinates,
    file,
    options: props.options,
  })
}
</script>

<style src="./editor.scss" lang="scss" scoped></style>
