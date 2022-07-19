<template>
<article class="checklist">
  <PageHeader module="checklist"/>
  <div class="checklist__body">
    <Loading v-if="loading"/>
    <ChecklistItem
      v-else
      v-model="state.content"
      :date="state.date"
      :today="today"
      :files="state.files"
      @update:modelValue="onUpdateContent"/>
    <Controller>
      <template #left>
        <ButtonBasic href="./list/" icon-left="list">
          List
        </ButtonBasic>
      </template>
      <template #right>
        <ButtonBasic color="key" href="./edit/" icon-left="edit">
          Edit
        </ButtonBasic>
      </template>
    </Controller>
  </div>
  <ChecklistProgress v-if="!loading" :percent="percent"/>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { preferenceStore } from '../../store/preference'
import { getLastItem, editItem } from '../../structure/checklist/item'
import { checkTime, countingCheckbox } from '../../structure/checklist/lib'
import { err } from '../../libs/error'
import PageHeader from '../../components/page/header/index.vue'
import { ButtonBasic } from '../../components/button'
import { Controller } from '../../components/navigation'
import ChecklistItem from '../../components/pages/checklist/item.vue'
import ChecklistProgress from '../../components/pages/checklist/checklist-progress.vue'
import Loading from '../../components/etc/loading.vue'

const preference = preferenceStore()
const loading = ref<boolean>(true)
const state = reactive<any>({
  srl: NaN,
  content: '',
  date: '',
  percent: 0,
  files: [],
})
const today = computed<boolean>(() => {
  return !checkTime(state.date, preference.checklist.resetTime)
})
const percent = computed<number>(() => {
  if (!state.content) return 0
  const { percent } = countingCheckbox(state.content)
  return percent
})

async function onUpdateContent(str: string): Promise<void>
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
    loading.value = false
  }
  catch (e: any)
  {
    err([ '/pages/checklist/index.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
