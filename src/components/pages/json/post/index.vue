<template>
<form ref="$root" @submit.prevent="onSubmit(false)">
  <Fieldset :disabled="loading" class="fields">
    <Field label="분류" for="category">
      <FormSelect
        id="category"
        name="category"
        v-model="forms.category_srl.value"
        :options="data.categories"
        value-type="string"
        placeholder="분류선택"
        class="category"/>
    </Field>
    <Field label="이름" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="50"
        placeholder="JSON 이름.."
        :error="!!forms.name.error"
        :required="true"
        class="fields__name"/>
    </Field>
    <Field label="설명" for="description">
      <FormInput
        v-model="forms.description.value"
        name="description"
        id="description"
        :maxlength="150"
        placeholder="설명내용.."
        :error="!!forms.name.error"
        class="fields__description"/>
    </Field>
  </Fieldset>
  <div class="json">
    <Editor
      v-if="!loading"
      ref="$editor"
      :use-attach-files="props.mode !== 'create'"
      v-model="forms.json.value"
      @submit="onSubmit(false)"
      @open-file-manager="visibleFileManager($event)"/>
    <Help v-if="!!forms.json.error" color="error" class="json__help">
      {{forms.json.error}}
    </Help>
  </div>
  <Fieldset :disabled="loading" class="fields">
    <Field label="URL 주소" for="path">
      <div class="path">
        <div class="path__input">
          <FormInput
            v-model="forms.path.value"
            name="path"
            id="path"
            :maxlength="255"
            placeholder="https://hostname/image.jpg"
            :error="!!forms.path.error"/>
        </div>
        <nav class="path__upload">
          <ButtonBasic
            color="key"
            icon-left="file-plus"
            @click="visibleFileManager({ mode: 'path' })">
            파일첨부
          </ButtonBasic>
        </nav>
      </div>
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
        v-if="props.mode !== 'create'"
        type="button"
        :icon-left="processing ? 'loader' : 'save'"
        :rotate-icon="processing"
        @click="onSubmit(true)">
        적용하기
      </ButtonBasic>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        {{submitLabel}}
      </ButtonBasic>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      :show="fileManager.open"
      :scroll="true"
      @close="visibleFileManager()">
      <ModalBody type="full">
        <FilesManager
          tab="post"
          :global="{ path: preference.files.globalPath }"
          :accept-file-type="preference.files.acceptFileType"
          :post="fileManagerOptions"
          :full-size="true"
          :use-thumbnail="false"
          :markdown="false"
          :output="fileManager.mode === 'text' ? 'text' : 'raw'"
          :limit-select="fileManager.limitSelect"
          @custom-event="onFilesManagerEvent"
          @close="visibleFileManager()"/>
      </ModalBody>
    </Modal>
  </teleport>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { post, formData, checkForms } from '../../../../libs/api'
import { getData } from '../../../../structure/json/post'
import { err } from '../../../../libs/error'
import { pureObject } from '../../../../libs/object'
import { arrayToTextForReturn } from '../../../files-manager/util'
import { toast } from '../../../../modules/toast'
import { preferenceStore } from '../../../../store/preference'
import { Fieldset, Field, Help } from '../../../forms/fieldset'
import { Controller } from '../../../navigation'
import { FormInput, FormSelect } from '../../../forms'
import { ButtonBasic } from '../../../button'
import { Modal, ModalBody } from '../../../modal'
import Editor from './editor.vue'
import FilesManager from '../../../files-manager/index.vue'

const router = useRouter()
const route = useRoute()
const $root = ref()
const $editor = ref()
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
})
const preference = preferenceStore()
const data = reactive({
  json: null,
  categories: null,
})
const forms = reactive({
  category_srl: {
    value: (!route.query.category || route.query.category === 'null') ? null : route.query.category,
    error: null,
  },
  name: { value: '', error: null },
  description: { value: '', error: null },
  json: { value: props.mode === 'create' ? '{}' : '', error: null },
  path: { value: '', error: null },
})
const loading = ref(true)
const processing = ref(false)
const submitLabel = computed(() => {
  switch (props.mode)
  {
    case 'edit':
      return 'JSON 수정하기'
    default:
      return 'JSON 만들기'
  }
})
const fileManager = reactive({
  open: false,
  mode: '', // editor,source,path
  limitSelect: 0,
})
const fileManagerOptions = computed(() => {
  return {
    module: 'json',
    targetSrl: props.srl,
    limitCount: preference.files.limitCount || 32,
    limitSize: preference.files.limitSize || 2000000,
  }
})

function validateForms()
{
  forms.json.error = null
  try
  {
    JSON.parse(forms.json.value)
  }
  catch (_)
  {
    forms.json.error = 'JSON 파싱하는데 오류가 발생했습니다.'
  }
}

function getStringJson(src)
{
  try
  {
    return JSON.stringify(src, null, 2)
  }
  catch (e)
  {
    return '{}'
  }
}

function visibleFileManager(options)
{
  if (options)
  {
    fileManager.open = true
    fileManager.mode = options.mode
    fileManager.limitSelect = [ 'editor', 'path' ].includes(options.mode) ? 1 : 0
  }
  else
  {
    fileManager.open = false
    fileManager.mode = ''
  }
}

function onFilesManagerEvent({ value })
{
  if (value?.length > 0)
  {
    let path
    switch (fileManager.mode)
    {
      case 'source':
        path = arrayToTextForReturn(value.map(o => o.path))
        $editor.value.insert(path)
        break
      case 'editor':
        path = value[0].path
        $editor.value.insert(path)
        break
      case 'path':
        if (!value[0]?.path) return
        forms.path.value = value[0].path
        break
    }
  }
  visibleFileManager()
}

async function onSubmit(onlySave = false)
{
  try
  {
    processing.value = true
    validateForms()
    checkForms(forms)
    const data = formData({
      category_srl: forms.category_srl.value || '',
      name: forms.name.value,
      description: forms.description.value || '',
      json: forms.json.value,
      path: forms.path.value || '',
    })
    const url = props.mode === 'edit' ? `/json/${props.srl}/edit/` : '/json/'
    const res = await post(url, data)
    processing.value = false
    const srl = res.srl || props.srl || NaN
    if (!onlySave)
    {
      await router.push(srl ? `/json/${srl}/` : '/json/')
    }
    switch (props.mode) {
      case 'edit':
        toast.add('JSON을 수정했습니다.', 'success').then()
        break
      case 'create':
        toast.add('JSON을 만들었습니다.', 'success').then()
        break
    }
  }
  catch (e)
  {
    err([ '/components/pages/json/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    switch (props.mode) {
      case 'edit':
        toast.add('JSON을 수정하지 못했습니다.', 'error').then()
        break
      case 'create':
        toast.add('JSON을 만들지 못했습니다.', 'error').then()
        break
    }
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const { json, categories } = await getData(props.srl)
    data.json = json
    data.categories = categories
    if (props.srl)
    {
      const newJson = pureObject(json)
      forms.category_srl.value = newJson?.category_srl
      forms.name.value = newJson?.name
      forms.description.value = newJson?.description
      forms.json.value = getStringJson(newJson?.json)
      forms.path.value = newJson?.path
    }
    loading.value = false
  }
  catch (e)
  {
    err([ '/components/pages/json/post.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
