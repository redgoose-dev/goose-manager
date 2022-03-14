<template>
<article class="thumbnail-editor">
  <h1 class="thumbnail-editor__title">
    Thumbnail editor
  </h1>
  <div class="thumbnail-editor__body">
    <Cropper
      ref="$cropper"
      v-model="data"
      :image="props.cropper?.image"
      :boundary="props.cropper?.boundary"
      :viewport="props.cropper?.viewport"/>
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
import { ref } from 'vue';
import { pureObject } from '../../../libs/object';
import ButtonBasic from '../../button/basic.vue';
import Cropper from '../../etc/cropper/index.vue';

const $cropper = ref();
const props = defineProps({
  srl: Number,
  data: Object, // {points,zoom,orientation}
  cropper: Object,
});
const emits = defineEmits([ 'close', 'submit' ]);
const data = ref({
  points: props.data?.points || [],
  zoom: props.data?.zoom || .25,
  orientation: props.data?.orientation || 1,
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
</script>

<style src="./editor.scss" lang="scss" scoped></style>
