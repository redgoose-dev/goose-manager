<template>
<article class="checklist">
  <PageHeader module="checklist" title="Checklist item"/>
  <div class="checklist__body">
    <Loading v-if="loading"/>
    <ChecklistItem
      v-if="!loading"
      v-model="state.content"
      v-model:checkboxes="checkboxes"
      :date="state.date"
      :today="false"
      :percent="state.percent"
      :files="state.files"/>
    <Controller>
      <template #left>
        <ButtonBasic href="../list/" icon-left="list">
          목록
        </ButtonBasic>
        <ButtonBasic color="key" href="../" icon-left="check">
          오늘로 이동
        </ButtonBasic>
      </template>
      <template #right>
        <ButtonBasic color="weak" href="./edit/" icon-left="edit">
          수정
        </ButtonBasic>
        <ButtonBasic color="error" href="./delete/" icon-left="trash">
          삭제
        </ButtonBasic>
      </template>
    </Controller>
  </div>
</article>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getItem } from '../../structure/checklist/item'
import { err } from '../../libs/error'
import PageHeader from '../../components/page/header/index.vue'
import { ButtonBasic } from '../../components/button'
import { Controller } from '../../components/navigation'
import ChecklistItem from '../../components/pages/checklist/item.vue'
import Loading from '../../components/etc/loading.vue'

const route = useRoute()
const loading = ref(true)
const state = reactive({
  srl: NaN,
  content: '',
  date: '',
  percent: NaN,
  files: [],
})
const checkboxes = ref(0)

onMounted(async () => {
  try
  {
    let res = await getItem(Number(route.params.srl))
    state.srl = res.srl
    state.content = res.content
    state.date = res.date
    state.percent = res.percent
    state.files = res.files
    loading.value = false
  }
  catch (e)
  {
    err([ '/pages/checklist/item.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style lang="scss" scoped>
.checklist {
  &__body {
    margin: 0 auto;
    max-width: 800px;
  }
}
</style>
