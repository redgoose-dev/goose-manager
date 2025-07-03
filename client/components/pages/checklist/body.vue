<template>
<div class="checklist-body">
  <h2 class="title">
    <strong>{{_title}}</strong>
    <em v-if="_showPercentage">{{props.percent}}%</em>
  </h2>
  <div ref="$body" class="content redgoose-body"/>
  <teleport to="#modals">
    <Lightbox
      :src="state.previewImage"
      :use-fetch="false"
      @close="state.previewImage = ''"/>
  </teleport>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import { preferenceStore } from '../../../store/app.js'
import { defaultOptions, baseRenderer, checklistRenderer, renderContent } from '../../../modules/marked.js'
import { replaceCheck } from '../../../structure/checklist/libs.js'
import { dateFormat } from '../../../libs/date.js'
import Lightbox from '../../content/lightbox.vue'

const $body = ref()
const preference = preferenceStore()
const props = defineProps({
  content: { type: String, required: true },
  checkbox: Number,
  date: { type: String },
  percent: Number,
  readonly: Boolean,
})
const emits = defineEmits([ 'update:content', 'update:checkbox' ])
const state = reactive({
  previewImage: '',
})

const _title = computed(() => {
  if (!props.date) return ''
  const date = props.date.split(' ')[0].split('-').map(o => Number(o))
  return dateFormat(new Date(date[0], date[1]-1, date[2]), preference.checklist.dateFormat)
})
const _showPercentage = computed(() => (!isNaN(props.percent)))

function onChangeCheckbox(e)
{
  const idx = e.target.id?.split('/')[1]
  if (!idx) return
  const checkMark = e.target.checked ? 'x' : ' '
  const body = replaceCheck(props.content, /\- \[[x|\s]\]/gmi, `- [${checkMark}]`, Number(idx) + 1)
  emits('update:content', body)
}

function initContentEvents()
{
  $body.value.querySelectorAll('img').forEach(el => {
    el.addEventListener('click', e => {
      state.previewImage = e.currentTarget.src
    })
  })
}

onMounted(async () => {
  // clear content
  $body.value.innerHTML = ''
  // set marked renderer
  let renderer = baseRenderer()
  renderer = checklistRenderer(renderer, props.readonly)
  const content = renderContent(props.content)
  const parsed = marked.parse(content, {
    ...defaultOptions,
    renderer,
  })
  if (!parsed) return
  // input content
  $body.value.innerHTML = parsed
  // set events
  const checkboxElements = $body.value.querySelectorAll('input[type=checkbox]')
  checkboxElements.forEach((o, k) => {
    o.setAttribute('id', `content-check/${k}`)
    o.addEventListener('change', onChangeCheckbox)
  })
  // update checkbox count
  emits('update:checkbox', checkboxElements.length)
  await nextTick()
  initContentEvents()
})
</script>

<style src="./body.scss" lang="scss" scoped></style>
