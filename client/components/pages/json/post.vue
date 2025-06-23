<template>
<form ref="$root" @submit.prevent="onSubmit">
  <Fieldset :disabled="state.loading">
    <Field
      v-if="state.category?.length > 0"
      label="분류"
      for="post-category">
      <FormSelect
        id="post-category"
        name="post-category"
        v-model="forms.category.value"
        :options="state.category"
        value-type="text"
        placeholder="JSON 분류"
        class="category"/>
    </Field>
    <Field label="이름" for="post-name">
      <FormInput
        id="post-name"
        name="post-name"
        v-model="forms.name.value"
        placeholder="JSON의 이름을 입력해주세요."
        :maxlength="36"
        :required="true"
        style="--input-width: 320px"/>
    </Field>
    <Field label="설명" for="post-description">
      <FormInput
        id="post-description"
        name="post-description"
        v-model="forms.description.value"
        placeholder="JSON을 설명하는 내용을 입력해주세요."
        :maxlength="200"/>
      <Help>이 JSON에 대한 설명을 입력합니다.</Help>
    </Field>
  </Fieldset>
  <Editor
    v-if="!state.loading"
    ref="$editor"
    v-model="forms.json.value"
    :use-attach-file="_isEdit"
    class="editor"
    @submit=""
    @open:file-manager="controlFileManager"/>
  <Fieldset :disabled="state.loading">
    <Field label="태그" for="post-tag">
      <FormTag
        v-model="forms.tag.value"
        id="post-tag"
        name="post-tag"
        :limit="10"/>
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
  <teleport to="#modals">
    <Modal
      v-if="_isEdit"
      :open="state.fileManager.open"
      mode="full"
      :scroll="false"
      :shortcut="true"
      @close="controlFileManager()">
      <FileManager
        module="json"
        :module-srl="props.srl"
        :shortcut="true"
        :use-thumbnail="false"
        :use-fetch="false"
        :multiple-selection="state.fileManager.mode !== 'editor'"
        class="file-manager"
        @insert="onInsertFile">
        <template #header>
          <FileManagerHeader
            title="가이드용 파일 매니저"
            :use-close="true"
            @close="controlFileManager()"/>
        </template>
      </FileManager>
    </Modal>
  </teleport>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { preferenceStore } from '../../../store/app.js'
import { getData, submit } from '../../../structure/json/post.js'
import { Fieldset, Field, Help } from '../../forms/fieldset/index.js'
import { FormSelect, FormInput, FormTag } from '../../forms/index.js'
import { Controller } from '../../navigation/index.js'
import { ButtonBasic } from '../../button/index.js'
import Editor from './editor.vue'
import { Modal } from '../../modal/index.js'
import { FileManager, FileManagerHeader } from '../../file-manager/index.js'

const router = useRouter()
const toast = inject('toast')
const error = inject('error')
const preference = preferenceStore()
const $root = ref()
const $editor = ref()
const errorPath = [ 'components', 'pages', 'json', 'post.vue' ]
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
})
const emits = defineEmits( [ 'submit' ])
const state = reactive({
  loading: props.mode === 'edit',
  processing: false,
  category: [],
  fileManager: {
    open: false,
    mode: '', // editor,source
  },
})
const forms = reactive({
  name: { value: '', error: null },
  description: { value: '', error: null },
  json: { value: '{}', error: null },
  category: { value: '', error: null },
  tag: { value: '', error: null },
})

const _isEdit = computed(() => (props.mode === 'edit'))
const _submitLabel = computed(() => {
  if (state.processing) return '처리중..'
  return _isEdit.value ? 'JSON 수정하기' : 'JSON 만들기'
})

onMounted(async () => {
  try
  {
    const { json, category } = await getData(props.mode, props.srl)
    if (json)
    {
      forms.name.value = json.name
      forms.description.value = json.description
      forms.category.value = json.category_srl
      forms.json.value = json.json
      forms.tag.value = json.tag
    }
    state.category = category
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: 'JSON을 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
})

function controlFileManager(mode)
{
  if (mode)
  {
    state.fileManager.open = true
    state.fileManager.mode = mode
  }
  else
  {
    state.fileManager.open = false
    state.fileManager.mode = ''
  }
}

function onInsertFile(file)
{
  $editor.value?.insert(file)
  controlFileManager()
}

async function onSubmit()
{
  try
  {
    state.processing = true
    const srl = await submit(props.srl, forms)
    const message = _isEdit.value ? 'JSON을 수정했습니다.' : 'JSON을 만들었습니다.'
    toast.add(message, 'success').then()
    emits('submit', srl)
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: _isEdit.value ? 'JSON을 수정하지 못했습니다.' : 'JSON을 만들지 못했습니다.',
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
