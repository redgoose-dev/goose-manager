<template>
<article class="resize-window">
  <PageHeader
    title="Resize Image"
    description="리사이즈 이미지 주소를 만듭니다."/>
  <form @submit.prevent>
    <article class="section">
      <h1>원본주소</h1>
      <FormInput
        name="resizePath"
        id="resizePath"
        :value="props.path"
        placeholder="url"
        :readonly="true"
        size="small"
        @click="onClickPath"/>
    </article>
    <article class="section input-form">
      <h1>입력 폼</h1>
      <Fieldset>
        <Field label="타입" for="resizeTypeCover">
          <Labels>
            <Label>
              <FormRadio
                v-model="forms.type"
                value="cover"
                name="resizeTypeCover"
                id="resizeTypeCover"
                size="small"/>
              <span>자르기</span>
            </Label>
            <Label>
              <FormRadio
                v-model="forms.type"
                value=""
                name="resizeTypeContain"
                size="small"/>
              <span>리사이즈</span>
            </Label>
          </Labels>
        </Field>
        <Field label="사이즈" for="resizeSizeWidth">
          <Labels>
            <Label>
              <span>가로:</span>
              <FormInput
                type="number"
                v-model="forms.width"
                name="resizeSizeWidth"
                id="resizeSizeWidth"
                placeholder="640"
                :min="100"
                :max="9999"
                size="small"
                class=""/>
              <span>px</span>
            </Label>
            <Label>
              <span>세로:</span>
              <FormInput
                type="number"
                v-model="forms.height"
                name="resizeSizeHeight"
                id="resizeSizeHeight"
                placeholder="480"
                :min="100"
                :max="9999"
                size="small"/>
              <span>px</span>
            </Label>
          </Labels>
        </Field>
        <Field label="품질" for="resizeQuality">
          <FormInput
            type="number"
            v-model="forms.quality"
            name="resizeQuality"
            id="resizeQuality"
            placeholder="90"
            :min="0"
            :max="100"
            size="small"
            class="input-quality"/>
        </Field>
      </Fieldset>
    </article>
    <article class="section">
      <h1>리사이즈 이미지 주소 결과</h1>
      <Keyword
        name="resizeAddress"
        id="resizeAddress"
        :model-value="result"
        :use-submit="true"
        :readonly="true"
        icon-submit="clipboard"
        @submit="onClickCopyClipboard"
        @click-input="onClickAddress"/>
    </article>
  </form>
  <Controller>
    <template #center>
      <ButtonBasic type="button" color="key" @click="emits('close')">
        닫기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { serialize, getResizePath } from '../../../../libs/string'
import { copyClipboard } from '../../../../libs/util'
import PageHeader from '../../../page/header/index.vue'
import { Fieldset, Field, Labels, Label } from '../../../forms/fieldset'
import { FormInput, FormRadio, Keyword } from '../../../forms'
import { ButtonBasic } from '../../../button'
import { Controller } from '../../../navigation'

const props = defineProps({
  path: String,
})
const emits = defineEmits([ 'close' ])
const forms = reactive({
  type: '', // cover
  width: 640,
  height: undefined,
  quality: undefined,
})
const result = computed(() => {
  return getResizePath(props.path, serialize({
    ...forms,
    width: forms.width > 0 ? Math.min(forms.width, 1000) : NaN,
    height: forms.height > 0 ? Math.min(forms.height, 1000) : NaN,
    quality: forms.quality > 0 ? Math.min(forms.quality, 100) : NaN,
  }))
})

function onClickCopyClipboard()
{
  copyClipboard(result.value)
}

function onClickPath(e)
{
  e.currentTarget.select()
}

function onClickAddress(e)
{
  e.currentTarget.select()
}
</script>

<style src="./resize-window.scss" lang="scss" scoped></style>
