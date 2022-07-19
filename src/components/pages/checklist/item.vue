<template>
<div class="checklist-item">
  <h3 class="checklist-item__title">
    <strong>{{title}}</strong>
    <em v-if="!isNaN(props.percent)">{{props.percent}}%</em>
  </h3>
  <div ref="$body" class="checklist-item__body redgoose-body redgoose-body--dark"/>
  <Files
    v-if="props.files?.length > 0"
    :items="props.files"
    class="checklist-item__files"/>
  <teleport to="#modals">
    <Modal :show="!!previewImage" @close="previewImage = null">
      <ModalBody>
        <PreviewImage :src="previewImage" @close="previewImage = null"/>
      </ModalBody>
    </Modal>
  </teleport>
</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { marked, Renderer } from 'marked'
import { preferenceStore } from '../../../store/preference'
import { dateFormat } from '../../../libs/date'
import { replaceMark } from '../../../structure/checklist/lib'
import { Modal, ModalBody } from '../../modal'
import PreviewImage from '../articles/item/preview-image.vue'
import Files from '../articles/item/files.vue'

interface Props {
  modelValue: string
  date: string
  today: boolean
  percent?: number
  files: any[]
}

const $body = ref<any>()
const props = defineProps<Props>()
const emits = defineEmits([ 'update:modelValue' ])
const preference = preferenceStore()
const processing = ref<boolean>(false)
const title = computed<string>(() => {
  const date = props.date.split(' ')[0].split('-').map(o => Number(o))
  return dateFormat(new Date(date[0], date[1]-1, date[2]), preference.checklist.dateFormat)
})
const previewImage = ref<string>('')

function initContentEvents()
{
  $body.value.querySelectorAll('img').forEach((el: HTMLElement) => {
    el.addEventListener('click', (e: any) => {
      previewImage.value = e.currentTarget.src
    })
  })
}

onMounted(async () => {
  const onChangeCheckbox = (e: any) => {
    const index = Number(e.target.dataset?.index)
    const checkMark = e.target.checked ? 'x' : ' '
    const body = replaceMark(props.modelValue, /\- \[[x|\s]\]/gmi, `- [${checkMark}]`, index + 1)
    emits('update:modelValue', body)
  }
  // clear content
  $body.value.innerHTML = ''
  // set marked renderer
  const renderer = new Renderer()
  renderer.listitem = (text, task) => {
    if (task)
    {
      text = text.replace(`disabled="" `, ``)
      return `<li class="checkbox-item"><label>${text}</label></li>`
    }
    else
    {
      return `<li>${text}</li>`
    }
  }
  const parsed = marked(props.modelValue, { renderer })
  if (!parsed) return
  // input content
  $body.value.innerHTML = parsed
  // set events
  const checkboxElements = $body.value.querySelectorAll('input[type=checkbox]')
  checkboxElements.forEach((o: any, k: number) => {
    let wrapper = document.createElement('label')
    wrapper.classList.add('checkbox')
    o.parentNode.insertBefore(wrapper, o)
    wrapper.appendChild(o)
    wrapper.appendChild(document.createElement('i'))
    if (props.today)
    {
      o.setAttribute('data-index', String(k))
      o.addEventListener('change', onChangeCheckbox)
    }
    else
    {
      o.setAttribute('disabled', 'disabled')
    }
  })
  await nextTick()
  initContentEvents()
})
</script>

<style src="./item.scoped.scss" lang="scss" scoped></style>
<style src="./item.scss" lang="scss"></style>
