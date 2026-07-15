<template>
<article class="thumbnail-editor">
  <header>
    <h1>썸네일 이미지 만들기</h1>
    <p>영역을 설정하여 이미지를 자릅니다.</p>
    <nav class="zoom">
      <i><Icon name="zoom-out"/></i>
      <p>
        <input
          type="range"
          :value="state.zoom"
          :min="ZOOM_MIN"
          :max="ZOOM_MAX"
          :step="0.01"
          @input="onChangeZoom">
      </p>
      <i><Icon name="zoom-in"/></i>
    </nav>
  </header>
  <div class="body" @wheel.prevent.stop="onWheel">
    <Cropper
      ref="$cropper"
      :src="_src"
      :stencil-size="_freeMode ? undefined : stencilSize"
      :stencil-props="_stencilProps"
      :default-size="defaultSize"
      image-restriction="stencil"
      :debounce="100"
      :auto-zoom="_autoZoom"
      :transitions="false"
      :move-image="_moveImage"
      :resize-image="_resizeImage"
      class="cropper"
      @ready="onReady"
      @change="onChange"/>
  </div>
  <footer>
    <fieldset class="preference">
      <div class="column">
        <ButtonGroup>
          <ButtonBasic
            size="small"
            icon-left=""
            :color="state.ratio === RATIO.FIXED ? 'sub' : ''"
            @click="state.ratio = RATIO.FIXED">
            고정
          </ButtonBasic>
          <ButtonBasic
            size="small"
            icon-left=""
            :color="state.ratio === RATIO.FREE ? 'sub' : ''"
            @click="state.ratio = RATIO.FREE">
            자유
          </ButtonBasic>
        </ButtonGroup>
      </div>
      <div class="column">
        <label for="size">사이즈</label>
        <FormInput
          type="number"
          name="size"
          id="size"
          v-model="state.size"
          size="small"
          :min="100"
          :max="9999"
          placeholder="1000"
          class="size"/>
      </div>
      <div class="column">
        <ButtonGroup>
          <ButtonBasic
            size="small"
            icon-left="star"
            color="key"
            @click="onClickSetting('save')">
            저장
          </ButtonBasic>
          <ButtonBasic
            size="small"
            icon-left="rotate-ccw"
            @click="onClickSetting('reset')">
            초기화
          </ButtonBasic>
        </ButtonGroup>
      </div>
    </fieldset>
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
  </footer>
</article>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch, inject } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import imageResize from 'image-resize'
import { currentStore } from '@/store/app.js'
import { addQueryParams } from '@/libs/object.js'
import { createRandomText } from '@/libs/strings.js'
import { blobToFile } from '@/libs/file.js'
import { ButtonGroup, ButtonBasic } from '@/components/button/index.js'
import { FormInput } from '@/components/forms/index.js'
import Icon from '@/components/icon/index.vue'
import 'vue-advanced-cropper/dist/style.css'

const RATIO = {
  FIXED: 'fixed',
  FREE: 'free',
}
const ZOOM_MIN = 0
const ZOOM_MAX = .75
const ZOOM_STEP = .05
const DEFAULT_CROP_SCALE = 0.9

const current = currentStore()
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
  ratio: current['article.thumbnail.ratio'] || RATIO.FIXED, // fixed,free
  size: current['article.thumbnail.size'] || Math.max(props.cropSize[0], props.cropSize[1]),
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
const _freeMode = computed(() => (state.ratio === RATIO.FREE))
const _autoZoom = computed(() => !_freeMode.value)
const _stencilProps = computed(() => {
  if (_freeMode.value)
  {
    return {
      movable: true,
      resizable: true,
    }
  }
  return {
    aspectRatio: _ratio.value,
    minAspectRatio: _ratio.value,
    maxAspectRatio: _ratio.value,
    handlers: {},
    movable: false,
    resizable: false,
  }
})
const _moveImage = computed(() => ({
  mouse: true,
  touch: true,
}))
const _resizeImage = computed(() => {
  return {
    adjustStencil: false,
    wheel: false,
  }
})

watch(() => state.ratio, async (value, oldValue) => {
  if (value === oldValue) return
  if (value !== RATIO.FIXED) return
  await nextTick()
  if (!$cropper.value) return
  $cropper.value.setCoordinates(({ coordinates }) => {
    if (!coordinates.width || !coordinates.height) return coordinates
    const currentRatio = coordinates.width / coordinates.height
    if (currentRatio === _ratio.value) return coordinates
    let width = coordinates.width
    let height = coordinates.height
    if (currentRatio > _ratio.value)
    {
      width = coordinates.height * _ratio.value
    }
    else
    {
      height = coordinates.width / _ratio.value
    }
    return {
      left: coordinates.left + ((coordinates.width - width) / 2),
      top: coordinates.top + ((coordinates.height - height) / 2),
      width,
      height,
    }
  })
})

function defaultSize({ imageSize })
{
  const savedCoordinates = props.options?.coordinates
  if (savedCoordinates?.width > 0 && savedCoordinates?.height > 0)
  {
    return {
      width: savedCoordinates.width,
      height: savedCoordinates.height,
    }
  }

  const size = Math.min(imageSize.height, imageSize.width) * DEFAULT_CROP_SCALE
  return {
    width: size,
    height: size,
  }
}
function stencilSize({ boundaries })
{
  return {
    width: Math.min(boundaries.height, boundaries.width) - 48,
    height: Math.min(boundaries.height, boundaries.width) - 48,
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
  const zoom = getCropperZoom()
  state.zoom = Number.isFinite(zoom)
    ? Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom))
    : ZOOM_MIN
}
function onChange()
{
  if (!$cropper.value) return
  const zoom = getCropperZoom()
  if (!Number.isFinite(zoom)) return
  const boundedZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom))
  if (Math.abs(zoom - boundedZoom) > 0.0001)
  {
    setZoom(boundedZoom)
    return
  }
  state.zoom = boundedZoom
}

function onChangeZoom(e)
{
  setZoom(Number(e.target.value))
}

function onWheel(e)
{
  const cropper = $cropper.value
  if (!cropper) return
  const delta = Number(e.deltaY || e.detail || e.wheelDelta)
  if (!delta) return

  const value = Math.min(
    ZOOM_MAX,
    Math.max(ZOOM_MIN, state.zoom + (delta > 0 ? -ZOOM_STEP : ZOOM_STEP)),
  )
  // vue-advanced-cropper는 wheel 중심점을 cropper 루트가 아닌
  // 내부 cropper-wrapper 기준으로 계산한다.
  const wrapper = cropper.$el?.querySelector('.vue-advanced-cropper__cropper-wrapper')
  const rect = wrapper?.getBoundingClientRect()
  const localCenter = rect
    ? { left: e.clientX - rect.left, top: e.clientY - rect.top }
    : undefined
  // zoom()은 wheel 이벤트처럼 wrapper 좌표를 받지 않고
  // visibleArea 기준 좌표를 받으므로 cropper 내부 좌표로 변환한다.
  const center = localCenter && cropper.visibleArea && Number.isFinite(cropper.coefficient)
    ? {
      left: localCenter.left * cropper.coefficient + cropper.visibleArea.left,
      top: localCenter.top * cropper.coefficient + cropper.visibleArea.top,
    }
    : localCenter
  setZoom(value, center)
}

function setZoom(value, center)
{
  const cropper = $cropper.value
  if (!cropper) return
  const currentZoom = getCropperZoom()
  const nextZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(value)))
  if (!Number.isFinite(currentZoom) || !Number.isFinite(nextZoom)) return
  if (Math.abs(currentZoom - nextZoom) < 0.0001)
  {
    state.zoom = nextZoom
    return
  }

  let z
  if (cropper.imageSize.height < cropper.imageSize.width)
  {
    const minHeight = cropper.sizeRestrictions.minHeight
    const imageHeight = cropper.imageSize.height
    z = (imageHeight - currentZoom * (imageHeight - minHeight)) / (imageHeight - nextZoom * (imageHeight - minHeight))
  }
  else
  {
    const minWidth = cropper.sizeRestrictions.minWidth
    const imageWidth = cropper.imageSize.width
    z = (imageWidth - currentZoom * (imageWidth - minWidth)) / (imageWidth - nextZoom * (imageWidth - minWidth))
  }
  cropper.zoom(z, center)
  state.zoom = nextZoom
}

function onChangeSize(value)
{
  current['article.thumbnail.size'] = Number(value)
}

function onClickSetting(mode)
{
  switch (mode)
  {
    case 'save':
      current['article.thumbnail.ratio'] = state.ratio
      current['article.thumbnail.size'] = state.size
      break
    case 'reset':
      current['article.thumbnail.ratio'] = null
      current['article.thumbnail.size'] = 0
      state.ratio = RATIO.FIXED
      state.size = Math.max(props.cropSize[0], props.cropSize[1])
      break
  }
}

async function onSubmit()
{
  const result = $cropper.value?.getResult()
  if (!result) return
  const { coordinates, canvas } = result
  const width = Number(coordinates?.width)
  const height = Number(coordinates?.height)
  const ratio = width / height
  const size = Math.round(Number(state.size))
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return
  if (!Number.isFinite(ratio) || ratio <= 0 || !Number.isFinite(size) || size <= 0) return
  const outputSize = width >= height ? {
    width: size,
    height: Math.max(1, Math.round(size / ratio)),
  } : {
    width: Math.max(1, Math.round(size * ratio)),
    height: size,
  }
  const blob = await imageResize(canvas, {
    ...outputSize,
    format: 'webp',
    quality: .78,
    outputType: 'blob',
    reSample: 2,
    sharpen: .35,
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
