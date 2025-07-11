<template>
<Loading v-if="state.loading"/>
<form v-else-if="_ready" ref="$root" @submit.prevent="save">
  <Fieldset>
    <Field label="분류" for="post-category">
      <FormSelect
        name="post-category"
        id="post-category"
        v-model="forms.category_srl"
        :options="data.category"
        placeholder="분류를 선택하세요."
        class="category"/>
    </Field>
    <Field label="제목" for="post-title">
      <FormInput
        id="post-title"
        name="post-title"
        v-model="forms.title"
        placeholder="아티클의 제목을 입력해주세요."
        :maxlength="120"
        :required="true"
        pattern="\S(.*\S)?"
        style="--input-width:75%"/>
    </Field>
    <Fields>
      <Field label="등록일" for="post-regdate">
        <FormInput
          type="date"
          name="post-regdate"
          id="post-regdate"
          v-model="forms.regdate"
          class="regdate"/>
      </Field>
      <Field label="모드" for="post-mode">
        <div class="mode">
          <label>
            <FormRadio
              name="post-mode"
              v-model="forms.mode"
              value="ready"
              :disabled="true"/>
            <span>대기</span>
          </label>
          <label>
            <FormRadio
              name="post-mode"
              id="post-mode"
              v-model="forms.mode"
              value="public"/>
            <span>공개</span>
          </label>
          <label>
            <FormRadio
              name="post-mode"
              v-model="forms.mode"
              value="private"/>
            <span>비공개</span>
          </label>
        </div>
      </Field>
    </Fields>
  </Fieldset>
  <div class="content">
    <PostToolbar
      :use-file-manager="true"
      :use-preview="true"
      class="content__toolbar"
      @select="onSelectToolbar"/>
    <FormTextarea
      ref="$content"
      name="post-content"
      id="post-content"
      v-model:content="forms.content"
      v-model:position="state.position"
      :auto-size="true"
      :required="true"
      class="content__editor"/>
  </div>
  <Fieldset>
    <Field label="태그" for="post-tag">
      <FormTag
        id="post-tag"
        name="post-tag"
        v-model="forms.tag"
        :limit="10"/>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic type="button" icon-left="arrow-left" @click="router.back()">
        뒤로가기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic
          type="button"
          color="base"
          :icon-left="state.processing ? 'loader' : 'cloud-check'"
          :disabled="state.processing"
          :rotate-icon="state.processing"
          @click="quickSave">
          빠른저장
        </ButtonBasic>
        <ButtonBasic
          type="button"
          color="key"
          :icon-left="state.processing ? 'loader' : 'check'"
          :disabled="state.processing"
          :rotate-icon="state.processing"
          @click="publishing">
          저장완료
        </ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      :open="state.openFileManager"
      mode="full"
      :scroll="true"
      :shortcut="true"
      @close="state.openFileManager = false">
      <FileManager
        module="article"
        :module-srl="data.article.srl"
        :shortcut="true"
        :private="true"
        :multiple-selection="true"
        file-key="code"
        :use-thumbnail="true"
        @insert="onInsertFileManager"
        @update-thumbnail="onUpdateThumbnail">
        <template #header>
          <ModalHeader
            title="아티클 첨부파일"
            icon="file-search"
            @close="state.openFileManager = false"/>
        </template>
      </FileManager>
    </Modal>
    <Preview
      title="아티클 내용 미리보기"
      :content="state.preview"
      :private="true"
      @close="controlPreview(false)"/>
  </teleport>
</form>
<Empty v-else title="Error Data"/>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getData, submit } from '../../../../structure/article/post.js'
import { dateFormat } from '../../../../libs/date.js'
import { Fieldset, Fields, Field } from '../../../forms/fieldset/index.js'
import { FormSelect, FormInput, FormTag, FormTextarea, FormRadio } from '../../../forms/index.js'
import { Controller, PostToolbar } from '../../../navigation/index.js'
import { ButtonGroup, ButtonBasic } from '../../../button/index.js'
import { Modal, ModalHeader } from '../../../modal/index.js'
import { Loading, Empty, Preview } from '../../../content/index.js'
import { FileManager } from '../../../file-manager/index.js'

const router = useRouter()
const preference = inject('preference')
const toast = inject('toast')
const error = inject('error')
const errorPath = [ 'components', 'pages', 'article', 'post', 'index.vue' ]
const $root = ref()
const $content = ref()
const props = defineProps({
  mode: { type: String, required: true },
  nest: Number,
  srl: Number,
})
const emits = defineEmits( [ 'submit' ])
const state = reactive({
  loading: true,
  processing: false,
  position: { start: 0, end: 0 },
  preview: '',
  openFileManager: false,
})
const data = reactive({
  nest: null,
  article: null,
  category: [],
})
const forms = reactive({
  category_srl: '',
  title: '',
  regdate: '',
  mode: '',
  content: '',
  json: {},
  tag: '',
})

const _ready = computed(() => (!!data.nest && !!data.article))
const _isEdit = computed(() => (props.mode === 'edit'))
const _submitLabel = computed(() => {
  if (state.processing) return '처리중..'
  return _isEdit.value ? '아티클 수정하기' : '아티클 만들기'
})

onMounted(async () => {
  try
  {
    const res = await getData(props.nest, props.srl)
    const { nest, article, category, tag } = res
    if (!nest) throw new Error('둥지 데이터가 없습니다.')
    data.nest = nest
    data.article = article
    data.category = category
    forms.category_srl = article.category_srl || ''
    forms.title = article.title || ''
    forms.regdate = article.regdate || dateFormat(new Date(), '{yyyy}-{MM}-{dd}')
    forms.mode = article.mode || 'ready'
    forms.content = article.content || ''
    forms.json = article.json || {}
    forms.tag = tag || ''
    if (!_isEdit.value)
    {
      forms.app_srl = nest.app_srl
      forms.nest_srl = nest.srl
    }
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '아티클 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})

function onSelectToolbar(code, value)
{
  switch (code)
  {
    case 'insert':
      $content.value.insert(value.code, value.cursor)
      break
    case 'open-file-manager':
      state.openFileManager = true
      break
    case 'preview':
      controlPreview(true)
      break
  }
}

function controlPreview(sw)
{
  if (sw && !forms.content)
  {
    toast.add('내용이 비었습니다.', 'error').then()
    return
  }
  state.preview = sw ? forms.content : ''
}

function onInsertFileManager(str)
{
  $content.value.insert(str)
  state.openFileManager = false
}
function onUpdateThumbnail(o)
{
  forms.json.thumbnail = o.code
}

/**
 * save
 */
async function save()
{
  if (!$root.value.reportValidity()) throw new Error('폼 항목을 확인해주세요.')
  await submit(data.article.srl, forms)
}
async function quickSave()
{
  try
  {
    state.processing = true
    await save()
    toast.add('빠른저장 완료', 'success').then()
  }
  catch(e)
  {
    error.catch({
      path: [ ...errorPath, 'quickSave()' ],
      message: '빠른저장 실패',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
async function publishing()
{
  try
  {
    state.processing = true
    await save()
    emits('submit', data.article.srl)
  }
  catch(e)
  {
    error.catch({
      path: [ ...errorPath, 'publishing()' ],
      message: _isEdit.value ? '아티클을 수정하지 못했습니다.' : '아티클을 만들지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
