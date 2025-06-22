<template>
<div class="input-tag">
  <Tag
    v-for="o in _tags"
    :label="o"
    :use-remove="true"
    @remove="removeTag"/>
  <input
    v-if="!_limit"
    type="text"
    :name="props.name"
    :id="props.id"
    maxlength="20"
    v-model="ready"
    :placeholder="_placeholder"
    @paste="onPasteReady"
    @input="onInputReady"
    @keydown.delete="onKeydownDeleteReady"
    @keyup.enter="onKeyupEnterReady"
    @keydown.prevent.enter/>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Tag } from '../item/index.js'

const props = defineProps({
  modelValue: String,
  name: String,
  id: String,
  limit: Number,
})
const emits = defineEmits([ 'update:model-value' ])
const ready = ref('')

const _tags = computed(() => {
  if (!props.modelValue) return []
  return props.modelValue.split(',').map(o => {
    return o.trim()
  })
})
const _limit = computed(() => {
  if (!props.limit) return false
  return _tags.value.length > props.limit - 1
})
const _placeholder = computed(() => {
  let str = '태그 입력'
  if (props.limit)
  {
    return `${str} (최대 ${props.limit}개)`
  }
  else
  {
    return str
  }
})

function onInputReady(e)
{
  if (/^.*[^,]$/.test(e.target.value)) return
  const newTag = e.target.value.split(',').filter(Boolean)[0]?.trim()
  if (newTag) addTag([ newTag ])
  ready.value = ''
}
function onPasteReady(e)
{
  const text = e.clipboardData.getData('text')
  const tags = text.split(',').filter(Boolean)
  addTag(tags)
  ready.value = ''
  e.preventDefault()
}
function onKeydownDeleteReady(e)
{
  if (e.code !== 'Backspace' || ready.value.length > 0) return
  if (!_tags.value.length) return
  removeTag(_tags.value[_tags.value.length - 1])
}
function onKeyupEnterReady(e)
{
  const newTag = e.target.value.split(',').filter(Boolean)[0]?.trim()
  if (newTag) addTag([ newTag ])
  ready.value = ''
}

function addTag(newTags)
{
  if (_limit.value) return
  updateModelValue([ ...new Set([ ..._tags.value, ...newTags ]) ])
}

function removeTag(tag)
{
  const idx = _tags.value.indexOf(tag)
  if (!(idx > -1)) return
  let newTags = [ ..._tags.value ]
  newTags.splice(idx, 1)
  updateModelValue(newTags)
}

function updateModelValue(newTags)
{
  emits('update:model-value', newTags.join(','))
}
</script>

<style src="./tag.scss" lang="scss" scoped></style>
