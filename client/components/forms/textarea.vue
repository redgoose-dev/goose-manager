<template>
<textarea
  ref="$root"
  :name="props.name"
  :id="props.id"
  :value="props.content"
  :required="props.required"
  :disabled="props.disabled"
  :readonly="props.readonly"
  :rows="props.rows"
  :placeholder="props.placeholder"
  autocomplete="off"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  :class="[
    'textarea',
    props.size && `size--${props.size}`,
    props.error && 'error',
    props.autoSize && 'auto-size',
  ]"
  @input="onChangeText"
  @click="onChangePosition"
  @keyup="onChangePosition"
  @keyup.ctrl.enter.stop="emits('submit')"
  @keydown.meta.enter.stop="emits('submit')"/>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const $root = ref()
const props = defineProps({
  name: String,
  id: String,
  content: String,
  placeholder: { type: String, default: '키워드를 입력해주세요.' },
  maxlength: Number,
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  rows: { type: Number, default: 4, },
  size: String, // small
  error: Boolean,
  autoSize: Boolean,
  position: Object,
})
const emits = defineEmits([ 'update:content', 'update:position', 'submit' ])

function onChangePosition(e)
{
  if (!('selectionStart' in e.target)) return
  emits('update:position', {
    start: e.target.selectionStart,
    end: e.target.selectionEnd
  })
}
function onChangeText(e)
{
  emits('update:content', e.target.value)
}

function focus()
{
  $root.value.focus()
}

/**
 * change cursor
 * @param {number} start
 * @param {number} end
 */
function changeCursor(start, end)
{
  $root.value.setSelectionRange(start, end)
}

/**
 * insert text
 * 폼 속에 텍스트를 넣는다.
 * @param {string} text 텍스트 내용
 * @param {number} cursor 커서가 들어가고 나서의 커서위치
 */
async function insert(text, cursor)
{
  if (!text) return
  if (!props.position) return
  let content = props.content + ''
  const { start } = props.position
  if (start === 0) text = text.replace(/^\n/g, '')
  content = content.slice(0, start) + text + content.slice(start)
  emits('update:content', content)
  let last = start + (cursor || text.length)
  emits('update:position', { start: last, end: last })
  await nextTick()
  changeCursor(props.position.start, props.position.end)
  focus()
}

defineExpose({
  changeCursor,
  focus,
  insert,
})
</script>

<style src="./textarea.scss" lang="scss" scoped></style>
