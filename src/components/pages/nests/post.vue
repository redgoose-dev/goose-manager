<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset :legend="message.word.basicFields" class="basic" :disabled="loading">
    <Field :label="message.word.appSrl" for="apps">
      <FormSelect
        id="apps"
        name="apps"
        v-model="forms.app_srl.value"
        :options="apps"
        :placeholder="message.words.selectAppSrl"
        style="--select-width: 240px"/>
    </Field>
    <Field :label="message.word.id" for="id">
      <FormInput
        type="text"
        name="id"
        id="id"
        v-model="forms.id.value"
        placeholder="Nest ID"
        :maxlength="24"
        :error="!!forms.id.error"
        :required="true"
        style="--input-width: 200px"/>
      <Help v-if="!!forms.id.error" color="error">{{forms.id.error}}</Help>
      <Help>
        {{printf(message.words.pleaseInputOnly, `"${message.word.alphanumeric}, \`-\` and \`_\`"`)}}
      </Help>
    </Field>
    <Field :label="message.word.name" for="name">
      <FormInput
        type="text"
        name="name"
        id="name"
        v-model="forms.name.value"
        placeholder="Goose's nest"
        :maxlength="40"
        :required="true"
        style="--input-width: 320px"/>
      <Help>
        {{printf(message.words.inputDescription, message.word.nest)}}
      </Help>
    </Field>
    <Field :label="message.word.description" for="description">
      <FormInput
        type="text"
        name="description"
        id="description"
        v-model="forms.description.value"
        placeholder="Description text.."
        :maxlength="200"/>
    </Field>
  </Fieldset>
  <Fieldset :legend="message.word.extraFields" class="extra" :disabled="loading">
    <Field :label="message.word.usingCategory" for="useCategory">
      <FormSwitch v-model="forms.json.useCategory" :values="[ '0', '1' ]"/>
    </Field>
    <Field :label="message.word.usingComment" for="useComment">
      <FormSwitch v-model="forms.json.useComment" :values="[ '0', '1' ]"/>
    </Field>
    <Field :label="message.word.thumbnailSize" for="thumbnailWidth">
      <Labels>
        <Label>
          <span>{{message.word.width}}:</span>
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
          <span>{{message.word.height}}:</span>
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
    <Field :label="message.word.thumbnailType" for="thumbnailType">
      <Labels>
        <Label>
          <FormRadio
            name="thumbnailType"
            id="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="crop"/>
          <span>{{message.word.crop}}</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resize"/>
          <span>{{message.word.resize}}</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resizeWidth"/>
          <span>{{message.word.resize}}({{message.word.width}})</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resizeHeight"/>
          <span>{{message.word.resize}}({{message.word.height}})</span>
        </Label>
      </Labels>
    </Field>
    <Field :label="message.word.uploadFilesCount" for="filesCount">
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
      <Help>{{message.words.uploadFilesCount}}</Help>
    </Field>
    <Field :label="message.word.uploadFilesSize" for="filesSize">
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
        {{message.word.back}}
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
import { printf, validateId, getByte } from '../../../libs/string'
import { pureObject } from '../../../libs/object'
import { message } from '../../../message'
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
  const code = props.mode === 'edit' ? message.word.isEdit : message.word.isCreate
  return printf(code, message.word.nest)
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
    forms.id.error = printf(message.words.pleaseCheck, 'ID')
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
    toast.add(printf(message.success[props.mode], message.word.nest), 'success').then()
  }
  catch (e: any)
  {
    err([ '/components/pages/nests/post.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    toast.add(printf(message.fail[props.mode], message.word.nest), 'error').then()
  }
}
</script>

<style src="./post.scss" lang="scss" scoped></style>
