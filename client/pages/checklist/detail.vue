<template>
<article>
  <PageHeader module="checklist" title="Checklist Item"/>
  <Loading v-if="state.loading"/>
  <ChecklistBody
    v-else-if="state.data"
    :content="state.data.content"
    :date="state.data.date"
    :readonly="true"/>
  <Empty v-else title="No data"/>
  <Controller>
    <template #left>
      <ButtonGroup>
        <ButtonBasic href="../index/" icon-left="list">
          목록
        </ButtonBasic>
        <ButtonBasic
          v-if="state.fileIndex?.length > 0"
          icon-left="file-search"
          color="code"
          @click="state.fileWindow = true">
          {{state.fileIndex.length}}개의 첨부파일
        </ButtonBasic>
        <ButtonBasic href="../" icon-left="sun" color="key">
          오늘로 이동
        </ButtonBasic>
      </ButtonGroup>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic href="./edit/" icon-left="edit">
          수정
        </ButtonBasic>
        <ButtonBasic href="./delete/" icon-left="trash-2" color="error">
          삭제
        </ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      :open="state.fileWindow"
      mode="full"
      :shortcut="true"
      :scroll="true"
      @close="state.fileWindow = false">
      <Files
        title="체크리스트 첨부파일"
        :items="state.fileIndex"
        :private="false"
        @close="state.fileWindow = false"/>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { getData } from '../../structure/checklist/detail.js'
import { checkTime } from '../../structure/checklist/libs.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty, Files } from '../../components/content/index.js'
import { Controller } from '../../components/navigation/index.js'
import { ButtonGroup, ButtonBasic } from '../../components/button/index.js'
import { Modal } from '../../components/modal/index.js'
import ChecklistBody from '../../components/pages/checklist/body.vue'

const route = useRoute()
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'checklist', 'detail.vue' ]
const state = reactive({
  loading: true,
  srl: Number(route.params.srl),
  data: null,
  fileWindow: false,
  fileIndex: [],
})

const _today = computed(() => {
  if (!state.data?.date) return false
  return !checkTime(state.data?.date, preference.checklist.resetTime)
})

onMounted(async () => {
  try
  {
    state.loading = true
    const { data, file } = await getData(state.srl)
    state.data = data
    state.fileIndex = file
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
</script>
