<template>
<article class="thumbnail-editor">
  <h1 class="thumbnail-editor__title">
    Thumbnail editor
  </h1>
  <div class="thumbnail-editor__body">
    <Cropper
      v-if="!loading"
      ref="$cropper"
      v-model="data"
      :image="props.cropper?.image"
      :boundary="props.cropper?.boundary"
      :viewport="viewport"/>
  </div>
  <nav class="thumbnail-editor__nav">
    <div>
      <ButtonBasic icon-left="x" @click="emits('close')">
        Close
      </ButtonBasic>
    </div>
    <div>
      <ButtonBasic color="key" icon-left="check" @click="onSubmit">
        Set thumbnail
      </ButtonBasic>
    </div>
  </nav>
</article>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { pureObject } from '../../../libs/object';
import { controlWindow } from '../util';
import { loadImage, getImageSize } from '../../../libs/util';
import ButtonBasic from '../../button/basic.vue';
import Cropper from '../../etc/cropper/index.vue';

const $cropper = ref();
const props = defineProps({
  srl: Number,
  type: String, // crop,resize,resizeWidth,resizeHeight
  data: Object, // {points,zoom,orientation}
  cropper: Object, // {viewport}
});
const emits = defineEmits([ 'close', 'submit' ]);
const data = ref({
  points: props.data?.points || [],
  zoom: props.data?.zoom || .25,
  orientation: props.data?.orientation || 1,
});
const loading = ref(true);
const viewport = ref({
  width: props.cropper.viewport.width,
  height: props.cropper.viewport.height,
  type: 'square',
});

async function onSubmit()
{
  let image = await $cropper.value.output();
  emits('submit', {
    srl: props.srl,
    ...pureObject(data.value),
    image,
  });
  emits('close');
}

onMounted(async () => {
  const { width, height } = props.cropper.viewport;
  controlWindow(true, 'thumbnail-editor');
  const image = await loadImage(props.cropper.image);
  let size = getImageSize(props.type, width, height, image.naturalWidth, image.naturalHeight);
  viewport.value.width = size.width;
  viewport.value.height = size.height;
  loading.value = false;
});
onUnmounted(() => {
  controlWindow(false, 'thumbnail-editor');
});
</script>

<style src="./editor.scss" lang="scss" scoped></style>
