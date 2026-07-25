<template>
<Loading v-if="state.loading"/>
<Empty
  v-else-if="!state.data"
  title="No data"
  message="로그 상세정보가 없습니다."
  icon="scroll-text"/>
<div v-else class="detail">
  <div class="body">
    <Fieldset>
      <FieldHeader>
        <template #title>기본 정보</template>
      </FieldHeader>
      <Field label="번호">
        <code>{{state.data.id || '-'}}</code>
      </Field>
      <Field label="시각">
        <code>{{formatTimestamp(state.data.timestamp)}}</code>
      </Field>
      <Field label="레벨">
        <div class="tags">
          <Tag :label="state.data.level || '-'" :color="getLevelColor(state.data.level)"/>
        </div>
      </Field>
      <Field label="상태">
        <span :class="[ 'status', getStatusClass(state.data.status) ]">{{state.data.status || '-'}}</span>
      </Field>
      <Field label="처리시간">
        <code>{{formatDuration(state.data.duration_ms)}}</code>
      </Field>
    </Fieldset>
    <Fieldset>
      <FieldHeader>
        <template #title>메시지</template>
      </FieldHeader>
      <Field label="내용">
        <span :class="[ !hasMessage(state.data) && 'is-empty' ]">
          {{getMessage(state.data)}}
        </span>
      </Field>
    </Fieldset>
    <Fieldset v-if="state.data.request">
      <FieldHeader>
        <template #title>요청</template>
      </FieldHeader>
      <Field label="메서드">
        <code>{{state.data.request.method || '-'}}</code>
      </Field>
      <Field label="경로">
        <code>{{state.data.request.path || '-'}}</code>
      </Field>
      <Field label="리퀘스트 아이디">
        <code>{{state.data.request.id || '-'}}</code>
      </Field>
    </Fieldset>
    <Fieldset v-if="state.data.error">
      <FieldHeader>
        <template #title>오류</template>
      </FieldHeader>
      <Field v-if="state.data.error.name" label="이름">
        <code>{{state.data.error.name}}</code>
      </Field>
      <Field v-if="state.data.error.message" label="메시지">
        {{state.data.error.message}}
      </Field>
      <Field v-if="state.data.error.stack" label="스택">
        <pre>{{state.data.error.stack}}</pre>
      </Field>
      <Field v-if="state.data.error.cause" label="원인">
        <pre>{{formatJSON(state.data.error.cause)}}</pre>
      </Field>
    </Fieldset>
    <Fieldset v-if="state.data.context">
      <FieldHeader>
        <template #title>컨텍스트</template>
      </FieldHeader>
      <Field label="내용">
        <pre>{{formatJSON(state.data.context)}}</pre>
      </Field>
    </Fieldset>
  </div>
  <Controller>
    <template #center>
      <ButtonBasic
        icon-left="x"
        @click="emits('close')">
        닫기
      </ButtonBasic>
    </template>
  </Controller>
</div>
</template>

<script setup>
import { reactive, watch, inject } from 'vue'
import { dateStore } from '@/store/app.js'
import { getData } from '@/structure/log/detail.js'
import { Loading, Empty } from '@/components/content/index.js'
import { Fieldset, Field, FieldHeader } from '@/components/forms/fieldset/index.js'
import { Tag } from '@/components/item/index.js'
import { Controller } from '@/components/navigation/index.js'
import { ButtonBasic } from '@/components/button/index.js'

const props = defineProps({
  id: { type: Number, required: true },
})
const emits = defineEmits([ 'close' ])
const error = inject('error')
const date = dateStore()
const errorPath = [ 'pages', 'log', '_comp', 'detail.vue' ]
const state = reactive({
  loading: true,
  data: null,
})
let loadId = 0

watch(() => props.id, _fetch, { immediate: true })

async function _fetch()
{
  const currentLoadId = ++loadId
  state.loading = true
  state.data = null
  try
  {
    const data = await getData(props.id)
    if (currentLoadId !== loadId) return
    state.data = data
  }
  catch (e)
  {
    if (currentLoadId !== loadId) return
    error.catch({
      path: [ ...errorPath, '_fetch()' ],
      message: '로그 상세정보를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    if (currentLoadId === loadId) state.loading = false
  }
}

function formatTimestamp(value)
{
  return date.format(value, 'date-time') || value || '-'
}

function formatDuration(value)
{
  if (value === null || value === undefined || value === '') return '-'
  const duration = Number(value)
  if (!Number.isFinite(duration)) return '-'
  if (duration >= 1000) return `${(duration / 1000).toFixed(duration >= 10000 ? 1 : 2)} s`
  return `${Math.round(duration * 100) / 100} ms`
}

function getMessage(item)
{
  return item.message || item.error?.message || '메시지 없음'
}

function hasMessage(item)
{
  return Boolean(item.message || item.error?.message)
}

function getLevelColor(level)
{
  switch (level)
  {
    case 'ERROR': return 'error'
    case 'WARNING': return 'base'
    case 'DEBUG': return 'code'
    case 'INFO':
    default:
      return 'blur'
  }
}

function getStatusClass(status)
{
  const value = Number(status)
  if (value >= 500) return 'status--error'
  if (value >= 400) return 'status--warning'
  if (value >= 200 && value < 400) return 'status--success'
  return ''
}

function formatJSON(value)
{
  if (typeof value === 'string') return value
  try
  {
    return JSON.stringify(value, null, 2)
  }
  catch (e)
  {
    return String(value)
  }
}
</script>

<style src="./detail.scss" lang="scss" scoped></style>
