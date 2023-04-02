<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset legend="기본 필드" class="basic" :disabled="loading">
    <Field label="앱 번호" for="apps">
      <FormSelect
        id="apps"
        name="apps"
        v-model="forms.app_srl.value"
        :options="apps"
        placeholder="앱 번호 선택"
        style="--select-width: 240px"/>
    </Field>
    <Field label="아이디" for="id">
      <FormInput
        type="text"
        name="id"
        id="id"
        v-model="forms.id.value"
        placeholder="둥지 아이디"
        :maxlength="24"
        :error="!!forms.id.error"
        :required="true"
        style="--input-width: 200px"/>
      <Help v-if="!!forms.id.error" color="error">{{forms.id.error}}</Help>
      <Help>
        아이디를 "알파벳과 숫자형식의 글자, `-` and `_`"으로만 입력해주세요.
      </Help>
    </Field>
    <Field label="이름" for="name">
      <FormInput
        type="text"
        name="name"
        id="name"
        v-model="forms.name.value"
        placeholder="둥지이름.."
        :maxlength="40"
        :required="true"
        style="--input-width: 320px"/>
    </Field>
    <Field label="설명" for="description">
      <FormInput
        type="text"
        name="description"
        id="description"
        v-model="forms.description.value"
        placeholder="둥지설명 내용.."
        :maxlength="200"/>
      <Help>
        이 "둥지"에 대한 설명을 입력합니다.
      </Help>
    </Field>
  </Fieldset>
  <Fieldset legend="엑스트라 필드" class="extra" :disabled="loading">
    <Field label="분류 사용하기" for="useCategory">
      <FormSwitch v-model="forms.json.useCategory" :values="[ '0', '1' ]"/>
    </Field>
    <Field label="댓글 사용하기" for="useComment">
      <FormSwitch v-model="forms.json.useComment" :values="[ '0', '1' ]"/>
    </Field>
    <Field label="썸네일 이미지 사이즈" for="thumbnailWidth">
      <Labels>
        <Label>
          <span>가로:</span>
          <FormInput
            type="number"
            name="thumbnailWidth"
            id="thumbnailWidth"
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
            name="thumbnailHeight"
            id="thumbnailHeight"
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
    <Field label="썸네일 이미지 타입" for="thumbnailType">
      <Labels>
        <Label>
          <FormRadio
            name="thumbnailType"
            id="thumbnailType"
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
    <Field label="업로드 파일갯수" for="filesCount">
      <FormInput
        type="number"
        name="filesCount"
        id="filesCount"
        v-model="forms.json.files.count"
        placeholder="5"
        :min="1"
        :max="99"
        size="small"
        style="--input-width: 70px"/>
      <Help>업로드 할 수 있는 파일의 갯수를 설정합니다.</Help>
    </Field>
    <Field label="업로드 파일사이즈" for="filesSize">
      <Label>
        <FormInput
          type="number"
          name="filesSize"
          id="filesSize"
          v-model="forms.json.files.sizeSingle"
          placeholder="5242880"
          :min="100"
          :max="99999999"
          size="small"
          class="input-file-size"/>
        <small>({{limitUploadFileSize}})</small>
      </Label>
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
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        {{submitLabel}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { post, formData, checkForms } from '../../../libs/api'
import { err } from '../../../libs/error'
import { validateId, getByte } from '../../../libs/string'
import { pureObject } from '../../../libs/object'
import { toast } from '../../../modules/toast'
import getData, { setJson, NestJSON } from '../../../structure/nests/post'
import { Fieldset, Field, Help, Labels, Label } from '../../forms/fieldset'
import { Controller } from '../../navigation'
import { FormInput, FormSelect, FormRadio, FormSwitch } from '../../forms'
import { ButtonBasic } from '../../button'

interface Forms {
  app_srl: { value: string, error: any }
  id: { value: string, error: any }
  name: { value: string, error: any }
  description: { value: string, error: any }
  json: NestJSON
}

const root = ref()
const router = useRouter()
const props = defineProps<{
  mode: string
  srl?: number
}>()
const forms = reactive<Forms>({
  app_srl: { value: '', error: null },
  id: { value: '', error: null },
  name: { value: '', error: null },
  description: { value: '', error: null },
  json: setJson(),
})
const apps = ref()
const loading = ref<boolean>(true)
const processing = ref<boolean>(false)
const limitUploadFileSize = computed<string>(() => getByte(forms.json.files?.sizeSingle || 0))
const submitLabel = computed<string>(() => {
  return props.mode === 'edit' ? '둥지 수정하기' : '둥지 만들기'
})

onMounted(async () => {
  try
  {
    const res = await getData(props.mode, Number(props.srl))
    if (props.mode === 'edit')
    {
      forms.app_srl.value = res.nest.app_srl
      forms.id.value = res.nest.id
      forms.name.value = res.nest.name
      forms.description.value = res.nest.description
    }
    apps.value = res.apps
    forms.json = res.nest.json
    loading.value = false
  }
  catch (e: any)
  {
    err([ '/components/pages/nests/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})

async function onSubmit(): Promise<void>
{
  forms.id.error = null
  if (!validateId(forms.id.value))
  {
    forms.id.error = '아이디를 확인해주세요.'
    root.value.id.focus()
  }
  try
  {
    processing.value = true
    checkForms(forms)
    const data = formData({
      app_srl: forms.app_srl.value,
      id: forms.id.value,
      name: forms.name.value,
      description: forms.description.value,
      json: JSON.stringify(pureObject(forms.json)),
    })
    await post((props.mode === 'edit') ? `/nests/${props.srl}/edit/` : '/nests/', data)
    processing.value = false
    await router.push('/nests/')
    const message = props.mode === 'edit' ? '둥지를 수정했습니다.' : '둥지를 만들었습니다.'
    toast.add(message, 'success').then()
  }
  catch (e: any)
  {
    err([ '/components/pages/nests/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    const message = props.mode === 'edit' ? '둥지를 수정하지 못했습니다.' : '둥지를 만들지 못했습니다.'
    toast.add(message, 'error').then()
  }
}
</script>

<style src="./post.scss" lang="scss" scoped></style>
