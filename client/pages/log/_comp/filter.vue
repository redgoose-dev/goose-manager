<template>
<form class="filter" @submit.prevent="onSubmit">
  <FilterTotal
    :total="props.total"
    class="filter__total"/>
  <fieldset :disabled="props.loading" class="filter__fields">
    <legend>로그 필터링 필드</legend>
    <FilterField label="기간 (UTC)">
      <FilterDateRange
        v-model:start="forms.from"
        v-model:end="forms.to"/>
    </FilterField>
    <FilterField label="레벨">
      <div class="levels">
        <div v-for="level in levels" :key="level" class="level">
          <FormCheckbox
            :id="`log-level-${level.toLowerCase()}`"
            :name="`log-level-${level.toLowerCase()}`"
            :model-value="forms.level.includes(level)"
            size="small"
            @update:model-value="onUpdateLevel(level, $event)"/>
          <label :for="`log-level-${level.toLowerCase()}`">
            {{level}}
          </label>
        </div>
      </div>
    </FilterField>
    <FilterField label="상태 코드" for="log-status">
      <FormInput
        id="log-status"
        name="log-status"
        v-model="forms.status"
        placeholder="100~599"
        :maxlength="3"
        :error="_invalidStatus"
        size="small"/>
    </FilterField>
    <FilterField label="메서드" for="log-method">
      <FormSelect
        id="log-method"
        name="log-method"
        v-model="forms.method"
        :options="methods"
        placeholder="모두"
        size="small"/>
    </FilterField>
    <FilterField label="경로" for="log-path">
      <FormInput
        id="log-path"
        name="log-path"
        v-model="forms.path"
        placeholder="/article/"
        :maxlength="500"
        size="small"/>
    </FilterField>
    <FilterField label="리퀘스트 ID" for="log-request-id">
      <FormInput
        id="log-request-id"
        name="log-request-id"
        v-model="forms.requestId"
        placeholder="ID"
        :maxlength="200"
        size="small"/>
    </FilterField>
    <FilterField label="키워드" for="log-keyword">
      <FormKeyword
        id="log-keyword"
        name="log-keyword"
        v-model="forms.q"
        placeholder="2글자 이상"
        :minlength="2"
        :maxlength="200"
        :use-submit="true"
        :processing="props.loading"
        size="small"
        @submit="onSubmit"/>
    </FilterField>
  </fieldset>
  <p v-if="_errorMessage" class="filter__error">
    {{_errorMessage}}
  </p>
  <nav class="filter__submit">
    <ButtonBasic
      type="submit"
      color="key"
      size="small"
      icon-left="search"
      :disabled="props.loading || Boolean(_errorMessage)">
      검색
    </ButtonBasic>
    <ButtonBasic
      type="button"
      size="small"
      icon-left="rotate-ccw"
      :disabled="props.loading"
      @click="onClickReset">
      재설정
    </ButtonBasic>
  </nav>
</form>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { FilterTotal, FilterField, FilterDateRange } from '@/components/forms/filter/index.js'
import { FormCheckbox, FormInput, FormKeyword, FormSelect } from '@/components/forms/index.js'
import { ButtonBasic } from '@/components/button/index.js'

const props = defineProps({
  loading: Boolean,
  total: Number,
})
const emits = defineEmits([ 'update' ])
const route = useRoute()
const levels = [ 'ERROR', 'WARNING', 'INFO', 'DEBUG' ]
const methods = [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS' ].map(value => ({
  label: value,
  value,
}))
const forms = reactive(getForms(route.query))

const _invalidStatus = computed(() => {
  const value = String(forms.status || '').trim()
  if (!value) return false
  return !/^\d{3}$/.test(value) || Number(value) < 100 || Number(value) > 599
})
const _invalidDate = computed(() => {
  return Boolean(forms.from && forms.to && forms.from > forms.to)
})
const _invalidKeyword = computed(() => {
  const value = forms.q.trim()
  return value.length === 1
})
const _errorMessage = computed(() => {
  if (_invalidDate.value) return '시작일은 종료일보다 늦을 수 없습니다.'
  if (_invalidStatus.value) return '상태 코드는 100부터 599까지 입력할 수 있습니다.'
  if (_invalidKeyword.value) return '키워드는 2글자 이상 입력해주세요.'
  return ''
})

watch(() => route.query, query => {
  Object.assign(forms, getForms(query))
})

function getQueryValue(value)
{
  return Array.isArray(value) ? value[0] : value
}

function getForms(query)
{
  const selectedLevels = String(getQueryValue(query.level) || '')
    .split(',')
    .filter(level => levels.includes(level))
  return {
    from: String(getQueryValue(query.from) || ''),
    to: String(getQueryValue(query.to) || ''),
    level: selectedLevels,
    status: String(getQueryValue(query.status) || ''),
    method: String(getQueryValue(query.method) || ''),
    path: String(getQueryValue(query.path) || ''),
    requestId: String(getQueryValue(query.request_id) || ''),
    q: String(getQueryValue(query.q) || ''),
  }
}

function onUpdateLevel(level, checked)
{
  if (checked && !forms.level.includes(level))
  {
    forms.level.push(level)
  }
  else if (!checked)
  {
    forms.level = forms.level.filter(value => value !== level)
  }
}

function onSubmit()
{
  if (_errorMessage.value) return
  emits('update', {
    from: forms.from || null,
    to: forms.to || null,
    level: forms.level.length > 0 ? forms.level.join(',') : null,
    status: forms.status.trim() || null,
    method: forms.method || null,
    path: forms.path.trim() || null,
    request_id: forms.requestId.trim() || null,
    q: forms.q.trim() || null,
  })
}

function onClickReset()
{
  Object.assign(forms, getForms({}))
  onSubmit()
}
</script>

<style src="./filter.scss" lang="scss" scoped></style>
