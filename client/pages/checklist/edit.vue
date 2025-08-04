<template>
<article>
  <PageHeader module="checklist" title="Edit Checklist"/>
  <Loading v-if="state.loading"/>
  <form v-else class="post" @submit.prevent="onSubmit">
    <h2 class="heading">{{_date}}</h2>
    <div class="body">
      <PostToolbar
        :use-file-manager="true"
        :use-preview="true"
        @select="onSelectToolbar"/>
      <FormTextarea
        ref="$content"
        v-model:content="forms.content.value"
        v-model:position="state.position"
        name="content"
        id="content"
        :auto-size="true"
        class="content"
        @submit="onSubmit"/>
    </div>
    <Controller>
      <template #left>
        <ButtonBasic
          type="button"
          icon-left="arrow-left"
          @click="router.back()">
          뒤로가기
        </ButtonBasic>
      </template>
      <template #right>
        <ButtonBasic
          type="submit"
          color="key"
          :icon-left="state.processing ? 'loader' : 'check'"
          :rotate-icon="state.processing">
          수정하기
        </ButtonBasic>
      </template>
    </Controller>
  </form>
  <teleport to="#modals">
    <Modal
      :open="state.openFileManager"
      mode="full"
      :scroll="true"
      :shortcut="true"
      @close="state.openFileManager = false">
      <FileManager
        module="checklist"
        :module-srl="state.srl"
        :shortcut="true"
        :private="false"
        :multiple-selection="true"
        file-key="code"
        @insert="onInsertFileManager">
        <template #header>
          <ModalHeader
            title="체크리스트 첨부파일"
            icon="file-search"
            @close="state.openFileManager = false"/>
        </template>
      </FileManager>
    </Modal>
    <Preview
      title="체크리스트 내용 미리보기"
      :content="state.preview"
      @close="controlPreview(false)"/>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getData, submit } from '../../structure/checklist/edit.js'
import { dateFormat } from '../../libs/date.js'
import PageHeader from '../../components/header/page.vue'
import { FormTextarea } from '../../components/forms/index.js'
import { PostToolbar, Controller } from '../../components/navigation/index.js'
import { ButtonBasic } from '../../components/button/index.js'
import { Loading, Preview } from '../../components/content/index.js'
import { FileManager } from '../../components/file-manager/index.js'
import { Modal, ModalHeader } from '../../components/modal/index.js'

const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'checklist', 'edit.vue' ]
const $content = ref()
const state = reactive({
  loading: true,
  processing: false,
  srl: Number(route.params.srl),
  date: '',
  position: { start: 0, end: 0 },
  preview: '',
  openFileManager: false,
})
const forms = reactive({
  content: { value: '', error: null },
})

const _date = computed(() => {
  if (!state.date) return ''
  return dateFormat(new Date(state.date), preference.checklist.dateFormat)
})

onMounted(async () => {
  try
  {
    const res = await getData(state.srl)
    state.srl = res.srl
    state.date = res.date
    forms.content.value = res.content
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '체크리스트 데이터를 가져오지 못했습니다.',
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
  if (sw && !forms.content.value)
  {
    toast.add('내용이 비었습니다.', 'error').then()
    return
  }
  state.preview = sw ? forms.content.value : ''
}

function onInsertFileManager(str)
{
  $content.value.insert(str)
  state.openFileManager = false
}

async function onSubmit()
{
  try
  {
    state.processing = true
    if (!state.srl) throw new Error('no srl')
    if (!forms.content.value) throw new Error('no content')
    await submit(state.srl, forms.content.value)
    toast.add('체크리스트 내용을 수정했습니다.', 'success').then()
    router.push('../').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: '체크리스트 내용을 수정하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./edit.scss" lang="scss" scoped></style>
