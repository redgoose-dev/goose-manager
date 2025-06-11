<template>
<Loading v-if="state.loading"/>
<form v-else ref="$root" @submit.prevent="onSubmit">
  <Fieldset legend="기본 필드" class="basic" :disabled="state.loading">
    <Field label="앱 번호" for="post-app">
      <FormSelect
        id="post-app"
        name="post-app"
        v-model="forms.app.value"
        :options="state.app"
        placeholder="앱을 선택해주세요."
        style="--select-width:400px"/>
    </Field>
    <Field label="코드" for="post-code">
      <FormInput
        id="post-code"
        name="post-code"
        v-model="forms.code.value"
        placeholder="둥지의 코드를 입력해주세요."
        :maxlength="24"
        :error="!!forms.code.error"
        :required="true"
        style="--input-width:240px"/>
      <Help v-if="!!forms.code.error" color="error">{{forms.code.error}}</Help>
      <Help>코드를 "알파벳, 숫자, `-` and `_`"으로만 입력해주세요.</Help>
    </Field>
    <Field label="이름" for="post-name">
      <FormInput
        id="post-name"
        name="post-name"
        v-model="forms.name.value"
        placeholder="둥지의 이름을 입력해주세요."
        :maxlength="36"
        :required="true"
        style="--input-width: 360px"/>
    </Field>
    <Field label="설명" for="post-description">
      <FormInput
        id="post-description"
        name="post-description"
        v-model="forms.description.value"
        placeholder="둥지를 설명하는 내용을 입력해주세요."
        :maxlength="200"/>
      <Help>이 "둥지"에 대한 설명을 입력합니다.</Help>
    </Field>
  </Fieldset>
  <Fieldset legend="엑스트라 필드" class="extra" :disabled="state.loading">
    <Field label="분류 사용하기" for="post-use-category">
      <FormSwitch
        id="post-use-category"
        name="post-use-category"
        v-model="forms.json.useCategory"
        :values="[ '0', '1' ]"/>
    </Field>
    <Field label="댓글 사용하기" for="post-use-comment">
      <FormSwitch
        id="post-use-comment"
        name="post-use-comment"
        v-model="forms.json.useComment"
        :values="[ '0', '1' ]"/>
    </Field>
    <Field label="썸네일 이미지 사이즈" for="post-thumbnail-width">
      <Labels>
        <Label>
          <span>가로:</span>
          <FormInput
            type="number"
            id="post-thumbnail-width"
            name="post-thumbnail-width"
            v-model="forms.json.thumbnail.width"
            placeholder="640"
            :min="100"
            :max="9999"
            size="small"
            class="input-thumbnail-size"/>
          <span>px</span>
        </Label>
        <Label>
          <span>세로:</span>
          <FormInput
            type="number"
            name="post-thumbnail-height"
            v-model="forms.json.thumbnail.height"
            placeholder="480"
            :min="100"
            :max="9999"
            size="small"
            class="input-thumbnail-size"/>
          <span>px</span>
        </Label>
      </Labels>
    </Field>
    <Field label="썸네일 이미지 타입" for="post-thumbnail-type">
      <Labels>
        <Label>
          <FormRadio
            id="post-thumbnail-type"
            name="post-thumbnail-type"
            v-model="forms.json.thumbnail.type"
            value="crop"/>
          <span>자르기</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resize"/>
          <span>리사이즈</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resizeWidth"/>
          <span>리사이즈(가로)</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resizeHeight"/>
          <span>리사이즈(세로)</span>
        </Label>
      </Labels>
    </Field>
    <Field label="업로드 파일갯수" for="post-files-count">
      <FormInput
        type="number"
        id="post-files-count"
        name="post-files-count"
        v-model="forms.json.files.count"
        placeholder="5"
        :min="1"
        :max="999"
        size="small"
        style="--input-width: 70px"/>
      <Help>업로드 할 수 있는 파일의 갯수를 설정합니다.</Help>
    </Field>
    <Field label="업로드 파일사이즈" for="post-files-size">
      <Labels>
        <Label>
          <FormInput
            type="number"
            id="post-files-size"
            name="post-files-size"
            v-model="forms.json.files.sizeSingle"
            placeholder="5242880"
            :min="100"
            :max="99999999"
            size="small"
            class="input-file-size"/>
          <small>({{_limitUploadFileSize}})</small>
        </Label>
      </Labels>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic icon-left="arrow-left" @click="router.back()">
        뒤로가기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="state.processing ? 'loader' : 'check'"
        :rotate-icon="state.processing"
        :disabled="state.processing">
        {{_submitLabel}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { getData, getJSON, submit } from '../../../structure/nest/post.js'
import { getByte, validateCode } from '../../../libs/strings.js'
import { pureObject } from '../../../libs/object.js'
import { Fieldset, Field, Help, Labels, Label } from '../../forms/fieldset/index.js'
import { FormSelect, FormInput, FormSwitch, FormRadio } from '../../forms/index.js'
import { Controller } from '../../navigation/index.js'
import { ButtonBasic } from '../../button/index.js'
import { Loading } from '../../content/index.js'

const router = useRouter()
const error = inject('error')
const toast = inject('toast')
const $root = ref()
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
})
const state = reactive({
  loading: true,
  processing: false,
  app: [],
})
const forms = reactive({
  app: { value: '', error: null },
  code: { value: '', error: null },
  name: { value: '', error: null },
  description: { value: '', error: null },
  json: {},
})
const errorPath = [ 'components', 'pages', 'nest', 'post.vue' ]

const _limitUploadFileSize = computed(() => {
  return getByte(forms.json.files?.sizeSingle || 0)
})
const _submitLabel = computed(() => {
  if (state.processing) return '처리중..'
  return props.mode === 'edit' ? '둥지 수정하기' : '둥지 만들기'
})

onMounted(async () => {
  try
  {
    const { app, nest } = await getData(props.mode, props.srl)
    if (props.mode === 'edit' && nest)
    {
      forms.app.value = nest.app_srl
      forms.code.value = nest.code
      forms.name.value = nest.name
      forms.description.value = nest.description
    }
    forms.json = getJSON(nest?.json)
    state.app = app
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '둥지 데이터를 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
})

async function onSubmit()
{
  forms.code.error = null
  if (!validateCode(forms.code.value))
  {
    forms.code.error = '코드를 확인해주세요.'
    return
  }
  try
  {
    state.processing = true
    await submit(props.srl, {
      app: forms.app.value,
      code: forms.code.value,
      name: forms.name.value,
      description: forms.description.value,
      json: JSON.stringify(pureObject(forms.json)),
    })
    await router.push('/nest/')
    const message = props.mode === 'edit' ? '둥지를 수정했습니다.' : '둥지를 만들었습니다.'
    toast.add(message, 'success').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: props.mode === 'edit' ? '둥지를 수정하지 못했습니다.' : '둥지를 만들지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./post.scss" lang="scss" scoped></style>
