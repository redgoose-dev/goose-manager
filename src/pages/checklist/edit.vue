<template>
<article class="checklist-edit">
  <PageHeader module="checklist" title="Checklist / Edit"/>
  <form class="checklist-post" @submit.prevent="onSubmit">
    <header class="checklist-post__header">
      <h2>{{forms.date}}</h2>
    </header>
    <PostToolbar
      class="checklist-post__toolbar"
      @select-item="onSelectToolbarItem"/>
    <div class="checklist-post__body">
      <FormTextarea
        ref="$content"
        name="content"
        id="content"
        v-model="forms.content.value"
        :rows="8"
        :auto-size="true"
        @position="onUpdatePosition"
        @keydown.meta.enter="onSubmit"/>
    </div>
    <Controller>
      <template #left>
        <ButtonBasic icon-left="arrow-left" @click="router.back()">뒤로가기</ButtonBasic>
      </template>
      <template #right>
        <ButtonBasic
          type="submit"
          color="key"
          :icon-left="processing ? 'loader' : 'check'"
          :rotate-icon="processing">
          수정하기
        </ButtonBasic>
      </template>
    </Controller>
  </form>
  <teleport to="#modals">
    <Preview
      :show="showPreview"
      :content="preview"
      @close="controlPreview(false)"/>
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
          :use-thumbnail="false"
          :markdown="true"
          output="text"
          @custom-event="onFilesManagerEvent"
          @close="showFilesManager = false"/>
      </ModalBody>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { marked } from 'marked'
import { preferenceStore } from '../../store/preference'
import { err } from '../../libs/error'
import { toast } from '../../modules/toast'
import { dateFormat } from '../../libs/date'
import { baseRenderer } from '../../modules/marked'
import { getData, submit } from '../../structure/checklist/edit'
import * as elementCodes from '../../libs/element-codes.js'
import PageHeader from '../../components/page/header/index.vue'
import { Modal, ModalBody } from '../../components/modal'
import { FormTextarea } from '../../components/forms'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import PostToolbar from '../../components/navigation/post-toolbar.vue'
import Preview from '../../components/content/preview.vue'
import FilesManager from '../../components/files-manager/index.vue'

const router = useRouter()
const route = useRoute()
const preference = preferenceStore()
const $content = ref()
const loading = ref(true)
const processing = ref(false)
const forms = reactive({
  srl: Number(route.params.srl),
  date: '',
  content: { value: '', error: null },
})
const position = ref({ start: 0, end: 0 })
const showPreview = ref(false)
const preview = ref('')
const showFilesManager = ref(false)
const fileManagerOptions = computed(() => {
  const { limitUploadFilesCount, limitUploadFileSize } = preference.checklist
  return {
    module: 'checklist',
    targetSrl: forms.srl,
    limitCount: limitUploadFilesCount || preference.files.limitCount || 32,
    limitSize: limitUploadFileSize || preference.files.limitSize || 2000000,
  }
})

async function insertText(text, cursor)
{
  if (!text) return
  let content = forms.content.value + ''
  const { start } = position.value
  if (start === 0) text = text.replace(/^\n/g, '')
  content = content.substr(0, start) + text + content.substr(start)
  forms.content.value = content
  let last = start + (cursor || text.length)
  position.value.start = last
  position.value.end = last
  await nextTick()
  $content.value.changeHeight()
  $content.value.changeCursor(position.value.start, position.value.end)
  $content.value.focus()
}

function onSelectToolbarItem(code)
{
  switch (code)
  {
    case 'insert-space':
      insertText(elementCodes.space)
      break
    case 'insert-iframe':
      insertText(elementCodes.iframe.code, elementCodes.iframe.cursor)
      break
    case 'insert-grid-group':
      insertText(elementCodes.gridGroup.code, elementCodes.gridGroup.cursor)
      break
    case 'insert-grid-item':
      insertText(elementCodes.gridItem.code, elementCodes.gridItem.cursor)
      break
    case 'insert-picture':
      insertText(elementCodes.darkModeImage)
      break
    case 'open-file-manager':
      showFilesManager.value = true
      break
    case 'preview':
      controlPreview(true)
      break
  }
}

function onUpdatePosition(o)
{
  position.value.start = o.start
  position.value.end = o.end
}

function controlPreview(sw)
{
  if (sw && !forms.content.value)
  {
    toast.add('이 내용은 비어있습니다.', 'error').then()
    return
  }
  if (sw)
  {
    const renderer = baseRenderer()
    preview.value = marked.parse(forms.content.value, { renderer })
  }
  else
  {
    preview.value = ''
  }
  showPreview.value = sw
}

async function onSubmit()
{
  try
  {
    processing.value = true
    if (!forms.srl) throw new Error('no srl')
    if (!forms.content.value) throw new Error('no content')
    await submit(forms.srl, forms.content.value)
    await router.push(route.params.srl ? `/checklist/${forms.srl}/` : `/checklist/`)
  }
  catch (e)
  {
    err([ '/pages/checklist/edit.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    toast.add('체크리스트를 수정하지 못했습니다.', 'error').then()
  }
}

function onFilesManagerEvent({ key, value })
{
  switch (key)
  {
    case 'insert-text':
      insertText(value)
      showFilesManager.value = false
      break
  }
}

onMounted(async () => {
  try
  {
    const res = await getData(forms.srl)
    forms.srl = res.srl
    forms.content.value = res.content
    const regdate = res.date.split(' ')[0].split('-').map(o => Number(o))
    forms.date = dateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), preference.checklist.dateFormat)
    await nextTick()
    $content.value.changeHeight()
    loading.value = false
  }
  catch (e)
  {
    err([ '/pages/checklist/edit.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./edit.scss" lang="scss" scoped></style>
