<template>
<form ref="$root" v-if="!loading" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="processing">
    <Field v-if="data.categories?.length > 0" label="분류" for="category">
      <FormSelect
        id="category"
        name="category"
        v-model="forms.category_srl"
        :options="data.categories"
        placeholder="분류선택"
        class="category"/>
    </Field>
    <Field label="제목" for="title">
      <FormInput
        name="title"
        id="title"
        v-model="forms.title.value"
        :maxlength="120"
        placeholder="아티클 제목.."
        :error="!!forms.title.error"
        :required="true"
        pattern="\S(.*\S)?"/>
    </Field>
    <Columns style="--columns-template: .75fr 1fr">
      <Field label="아티클 날짜" for="order">
        <FormInput
          name="order"
          id="order"
          v-model="forms.order.value"
          :maxlength="10"
          placeholder="0000-00-00"
          :error="!!forms.order.error"
          :required="true"
          style="--input-width: 140px"/>
        <Help v-if="!!forms.order.error" color="error">
          {{forms.order.error}}
        </Help>
      </Field>
      <Field label="아티클 타입" for="type">
        <Labels class="types">
          <Label class="types__label ready">
            <FormRadio
              name="type"
              id="type"
              v-model="forms.type"
              :disabled="true"
              value="ready"/>
            <span>대기</span>
          </Label>
          <Label class="types__label public">
            <FormRadio name="type" v-model="forms.type" value="public"/>
            <span>공개</span>
          </Label>
          <Label class="types__label private">
            <FormRadio name="type" v-model="forms.type" value="private"/>
            <span>비공개</span>
          </Label>
        </Labels>
      </Field>
    </Columns>
  </Fieldset>
  <Editor
    ref="$editor"
    name="content"
    id="content"
    v-model="forms.content.value"
    placeholder="아티클 내용.."
    :required="true"
    :disabled="loading"
    class="editor"
    @submit="onSubmit"
    @open-file-manager="showFilesManager = true"/>
  <Controller>
    <template #left>
      <ButtonBasic type="button" icon-left="arrow-left" @click="router.back()">
        뒤로가기
      </ButtonBasic>
    </template>
    <template v-if="props.mode === 'edit'" #right>
      <ButtonBasic
        type="button"
        :icon-left="processing ? 'loader' : 'save'"
        :rotate-icon="processing"
        @click="publishing">
        저장하기
      </ButtonBasic>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        이티클 수정
      </ButtonBasic>
    </template>
    <template v-else #right>
      <ButtonBasic
        type="button"
        :icon-left="processing ? 'loader' : 'thermometer'"
        :rotate-icon="processing"
        @click="saveDraft">
        임시저장
      </ButtonBasic>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        퍼블리싱
      </ButtonBasic>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      v-if="!loading"
      :show="showFilesManager"
      :scroll="true"
      @close="showFilesManager = false">
      <ModalBody type="full">
        <FilesManager
          tab="post"
          :global="{ path: preference.files.globalPath }"
          :post="fileManagerOptions"
          :accept-file-type="preference.files.acceptFileType"
          :full-size="true"
          :use-thumbnail="true"
          :markdown="true"
          output="text"
          @custom-event="onFilesManagerEvent"
          @close="showFilesManager = false"/>
      </ModalBody>
    </Modal>
  </teleport>
</form>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { preferenceStore } from '../../../../store/preference'
import { getData, deleteThumbnail, uploadThumbnail } from '../../../../structure/articles/post'
import { post, formData } from '../../../../libs/api'
import { err } from '../../../../libs/error'
import { dateFormat, checkOrderDate } from '../../../../libs/date'
import { getTypeArticle, createQueries } from '../libs'
import { pureObject } from '../../../../libs/object'
import { toast } from '../../../../modules/toast'
import { FormInput, FormSelect, FormRadio } from '../../../forms'
import { Fieldset, Field, Label, Labels, Help, Columns } from '../../../forms/fieldset'
import { Controller } from '../../../navigation'
import { Modal, ModalBody } from '../../../modal'
import { ButtonBasic } from '../../../button'
import Editor from './editor.vue'
import FilesManager from '../../../files-manager/index.vue'

const route = useRoute()
const router = useRouter()
const $root = ref()
const $editor = ref()
const props = defineProps({
  mode: { type: String, required: true },
  nestSrl: Number,
  articleSrl: Number,
})
const preference = preferenceStore()
const data = reactive({
  nest: null,
  categories: null,
  article: null,
})
const forms = reactive({
  app_srl: null,
  nest_srl: props.nestSrl,
  category_srl: (!route.query.category || route.query.category === 'null') ? null : route.query.category,
  type: 'ready',
  title: {
    value: '',
    error: null,
  },
  order: {
    value: dateFormat(new Date(), '{yyyy}-{MM}-{dd}'),
    error: null,
  },
  content: {
    value: '',
    error: null,
  },
  json: {
    thumbnail: {},
  },
})
const loading = ref(true)
const processing = ref(false)
const showFilesManager = ref(false)
const fileManagerOptions = computed(() => {
  const { thumbnail, files } = data.nest.json
  return {
    module: 'articles',
    targetSrl: data.article?.srl,
    limitCount: files.count || preference.files.limitCount || 32,
    limitSize: files.sizeSingle || preference.files.limitSize || 2000000,
    cropper: {
      viewport: {
        width: thumbnail?.width || 320,
        height: thumbnail?.height || 240,
        type: 'square',
      },
    },
    thumbnail: forms.json.thumbnail || undefined,
    thumbnailType: thumbnail.type || 'crop',
  }
})

async function save(type)
{
  let json = Object.assign({}, forms.json)

  // check error
  forms.order.error = null

  // check title
  if (!forms.title.value.trim()) throw new Error('no title')

  // check order
  if (!checkOrderDate(forms.order.value))
  {
    forms.order.error = '"orderdate" 검사 실패했습니다.'
    throw new Error(forms.order.error)
  }

  // update thumbnail image
  if (forms.json.thumbnail?.image)
  {
    // delete current image
    if (data.article.json?.thumbnail?.path)
    {
      await deleteThumbnail(data.article.json.thumbnail.path)
    }
    // upload new image
    forms.json.thumbnail.path = await uploadThumbnail(forms.json.thumbnail.image)
    delete forms.json.thumbnail.image
  }
  if (!forms.json.thumbnail && data.article.json?.thumbnail?.path)
  {
    await deleteThumbnail(data.article.json.thumbnail.path)
  }

  // save article
  let res = await post(`/articles/${data.article.srl}/edit/`, formData({
    mode: props.mode === 'create' ? 'add' : 'edit',
    app_srl: data.nest.app_srl,
    nest_srl: data.nest.srl,
    category_srl: forms.category_srl || null,
    type: type === 'publishing' ? getTypeArticle(forms.type) : 'ready',
    title: forms.title.value?.trim() || '',
    content: forms.content.value || '',
    json: JSON.stringify(forms.json),
    order: forms.order.value,
  }))
  if (!res.success) throw new Error(res.message)
}
async function saveDraft()
{
  if (props.mode !== 'create') return
  if (processing.value) return
  try
  {
    processing.value = true
    await save('draft')
    processing.value = false
    toast.add('임시저장을 성공했습니다.', 'success').then()
  }
  catch (e)
  {
    err([ '/components/pages/articles/post/index.vue', 'saveDraft()' ], 'error', e.message)
    toast.add('임시저장을 실패했습니다.', 'error').then()
    processing.value = false
  }
}
async function publishing()
{
  if (processing.value) return
  try
  {
    processing.value = true
    if (forms.type === 'ready') forms.type = 'public'
    await save('publishing')
    processing.value = false
    switch (props.mode)
    {
      case 'create':
        toast.add('아티클을 만들었습니다.', 'success')
        break
      case 'edit':
        toast.add('아티클을 수정했습니다.', 'success')
        break
    }
  }
  catch (e)
  {
    err([ '/components/pages/articles/post/index.vue', 'publishing()' ], 'error', e.message)
    switch (props.mode)
    {
      case 'create':
        toast.add('아티클을 만들지 못했습니다.', 'error').then()
        break
      case 'edit':
        toast.add('아티클을 수정하지 못했습니다.', 'error').then()
        break
    }
    processing.value = false
  }
}
async function onSubmit()
{
  await publishing()
  switch (props.mode)
  {
    case 'edit':
    case 'create':
      await router.push(`../${createQueries(['category','page'], route.query)}`)
      break
    default:
      await router.push(`/articles/${createQueries(['category','page'], route.query)}`)
      break
  }
}

/**
 * on FilesManager event
 */
function onFilesManagerEvent({ key, value })
{
  switch (key)
  {
    case 'insert-text':
      insertTextToEditor(value)
      showFilesManager.value = false
      break
    case 'update-thumbnail':
      forms.json.thumbnail = value ? {
        srl: value.srl,
        path: forms.json.thumbnail?.path || undefined,
        image: value.image,
        points: value.points,
        zoom: value.zoom,
        orientation: value.orientation,
      } : undefined
      break
  }
}

/**
 * insert text to editor
 * 에디터 입력창에 문자를 넣는다.
 */
function insertTextToEditor(keyword, position = 0)
{
  if (!keyword) return
  let content = forms.content.value + ''
  let start = $editor.value.position.start
  if (start === 0) keyword = keyword.replace(/^\n/g, '')
  forms.content.value = content.substring(0, start) + keyword + content.substring(start)
  // change cursor
  let endPosition = start + (position ? position : keyword.length)
  $editor.value.changeCursor(endPosition, endPosition)
}

onMounted(async () => {
  try
  {
    loading.value = true
    let { nest, categories, article } = await getData(props.nestSrl, props.articleSrl)
    data.nest = nest
    data.categories = categories
    data.article = article
    const newArticle = pureObject(article)
    if (newArticle.category_srl)
    {
      forms.category_srl = newArticle.category_srl === 'null' ? null : newArticle.category_srl
    }
    forms.title.value = newArticle.title || ''
    forms.content.value = newArticle.content || ''
    forms.order.value = newArticle.order
    forms.type = newArticle.type || 'ready'
    forms.json = newArticle.json || { thumbnail: {} }
    loading.value = false
  }
  catch (e)
  {
    err([ '/components/pages/articles/post/index.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
