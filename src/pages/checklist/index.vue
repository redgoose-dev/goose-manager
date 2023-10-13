<template>
<article class="checklist">
  <PageHeader module="checklist"/>
  <Loading v-if="ready"/>
  <ChecklistItem
    v-else
    v-model="state.content"
    v-model:checkboxes="checkboxes"
    :date="state.date"
    :today="today"
    :files="state.files"
    :percent="NaN"
    @update:modelValue="onUpdateContent"/>
  <Controller>
    <template #left>
      <ButtonBasic href="./list/" icon-left="list">
        목록
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic color="key" href="./edit/" icon-left="edit">
        수정
      </ButtonBasic>
    </template>
  </Controller>
  <ChecklistProgress v-if="showProgressBar" :percent="percent"/>
</article>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { preferenceStore } from '../../store/preference'
import { getLastItem, editItem } from '../../structure/checklist/item'
import { checkTime, countingCheckbox } from '../../structure/checklist/lib'
import { err } from '../../libs/error'
import PageHeader from '../../components/page/header/index.vue'
import Loading from '../../components/etc/loading.vue'
import { ButtonBasic } from '../../components/button'
import { Controller } from '../../components/navigation'
import ChecklistItem from '../../components/pages/checklist/item.vue'
import ChecklistProgress from '../../components/pages/checklist/checklist-progress.vue'

const preference = preferenceStore()
const ready = ref(true)
const state = reactive({
  srl: NaN,
  content: '',
  date: '',
  percent: 0,
  files: [],
})
const checkboxes = ref(0)
const today = computed(() => {
  return !checkTime(state.date, preference.checklist.resetTime)
})
const percent = computed(() => {
  if (!state.content) return 0
  const { percent } = countingCheckbox(state.content)
  return percent
})
const showProgressBar = computed(() => {
  return !ready.value && checkboxes.value > 0
})

async function onUpdateContent(str)
{
  await editItem(state.srl, str)
}

onMounted(async () => {
  try
  {
    let res = await getLastItem()
    state.srl = res.srl
    state.content = res.content
    state.date = res.date
    state.percent = res.percent
    state.files = res.files
    ready.value = false
  }
  catch (e)
  {
    err([ '/pages/checklist/index.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
