<template>
<article class="checklist">
  <PageHeader module="checklist"/>
  <Loading v-if="state.loading"/>
  <ChecklistBody
    v-else
    v-model:content="state.content"
    v-model:checkbox="state.countCheckbox"
    :date="state.date"
    :percent="_percent"
    @update:content="onUpdateContent"/>
  <Controller>
    <template #left>
      <ButtonBasic href="./index/" icon-left="list">
        목록
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./edit/" icon-left="edit" color="key">
        수정하기
      </ButtonBasic>
    </template>
  </Controller>
  <ChecklistProgress v-if="_showProgress" :percent="_percent"/>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, inject } from 'vue'
import { getData, editData } from '../../structure/checklist/today.js'
import { checkTime, countingCheckbox } from '../../structure/checklist/libs.js'
import PageHeader from '../../components/header/page.vue'
import { Loading } from '../../components/content/index.js'
import { Controller } from '../../components/navigation/index.js'
import { ButtonBasic } from '../../components/button/index.js'
import ChecklistBody from '../../components/pages/checklist/body.vue'
import ChecklistProgress from '../../components/pages/checklist/progress.vue'

const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'checklist', 'today.vue' ]
const state = reactive({
  loading: true,
  srl: NaN,
  content: '',
  date: '',
  percent: NaN,
  countCheckbox: 0,
})

const _today = computed(() => {
  return !checkTime(state.date, preference.checklist.resetTime)
})
const _percent = computed(() => {
  if (!state.content) return NaN
  const { percent } = countingCheckbox(state.content)
  return percent
})
const _showProgress = computed(() => {
  return !state.loading && state.countCheckbox > 0
})

onMounted(async () => {
  try
  {
    state.loading = true
    const res = await getData()
    state.srl = res.srl
    state.content = res.content
    state.date = res.date
    state.percent = res.percent
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '체크리스트 데이터를 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.loading = false
  }
})

function onUpdateContent(str)
{
  editData(state.srl, str).then()
}
</script>
