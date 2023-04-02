<template>
<article>
  <PageHeader module="checklist" title="Edit checklist"/>
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
          @custom-event="onFilesManagerEvent"
          @close="showFilesManager = false"/>
      </ModalBody>
    </Modal>
  </teleport>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { marked } from 'marked'
import { preferenceStore } from '../../store/preference'
import { err } from '../../libs/error'
import { toast } from '../../modules/toast'
import { dateFormat } from '../../libs/date'
import { baseRenderer } from '../../modules/marked'
import { getData, submit } from '../../structure/checklist/edit'
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
const $content = ref<any>()
const loading = ref<boolean>(true)
const processing = ref<boolean>(false)
const forms = reactive<any>({
  srl: Number(route.params.srl),
  date: '',
  content: { value: '', error: null },
})
const position = ref<{ start: number, end: number }>({ start: 0, end: 0 })
const showPreview = ref<boolean>(false)
const preview = ref<string>('')
const showFilesManager = ref<boolean>(false)
const fileManagerOptions = computed<any>(() => {
  const { limitUploadFilesCount, limitUploadFileSize } = preference.checklist
  return {
    module: 'checklist',
    targetSrl: forms.srl,
    limitCount: limitUploadFilesCount,
    limitSize: limitUploadFileSize,
  }
})

async function insertText(text: string, cursor?: number): Promise<void>
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

function onSelectToolbarItem(code: string): void
{
  switch (code)
  {
    case 'insert-space':
      insertText(`<p><br/></p>\n`)
      break
    case 'insert-iframe':
      insertText(`<div class="iframe"></div>\n`, 20)
      break
    case 'insert-grid-group':
      insertText(`<div class="grid-group">\n\n</div>\n`, 25)
      break
    case 'insert-grid-item':
      insertText(`<figure class="grid-item" data-mobile="3" data-tablet="" data-desktop="" data-desktop-large="">\n\n</figure>\n`, 96)
      break
    case 'insert-picture':
      insertText(`<picture>\n  <source srcset="" media="(prefers-color-scheme: dark)"/>\n  <source srcset="" media="(prefers-color-scheme: light)"/>\n  <img src="" alt=""/>\n</picture>\n`)
      break
    case 'open-file-manager':
      showFilesManager.value = true
      break
    case 'preview':
      controlPreview(true)
      break
  }
}

function onUpdatePosition(o: { start: number, end: number }): void
{
  position.value.start = o.start
  position.value.end = o.end
}

function controlPreview(sw: boolean): void
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

async function onSubmit(): Promise<void>
{
  try
  {
    processing.value = true
    if (!forms.srl) throw new Error('no srl')
    if (!forms.content.value) throw new Error('no content')
    await submit(forms.srl, forms.content.value)
    await router.push(route.params.srl ? `/checklist/${forms.srl}/` : `/checklist/`)
  }
  catch (e: any)
  {
    err([ '/pages/checklist/edit.vue', 'onSubmit()' ], 'error', e.message)
    processing.value = false
    toast.add('체크리스트를 수정하지 못했습니다.', 'error').then()
  }
}

function onFilesManagerEvent({ key, value }: any): void
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
    const regdate = res.date.split(' ')[0].split('-').map((o: any) => Number(o))
    forms.date = dateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), preference.checklist.dateFormat)
    await nextTick()
    $content.value.changeHeight()
    loading.value = false
  }
  catch (e: any)
  {
    err([ '/pages/checklist/edit.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./edit.scss" lang="scss" scoped></style>
