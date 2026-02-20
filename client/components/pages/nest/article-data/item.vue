<template>
<div class="item">
  <ButtonIcon
    type="button"
    title="항목 순서변경"
    icon-name="move"
    size="small"
    color="transparent"
    class="move"/>
  <div class="body">
    <Labels>
      <Label>
        <span class="label-text first">이름</span>
        <FormInput
          :id="`article-data-${props.idx}-name`"
          v-model="model.name"
          size="small"
          placeholder="필드의 이름"
          :maxlength="20"/>
      </Label>
      <Label>
        <span class="label-text">타입</span>
        <FormSelect
          :id="`article-data-${props.idx}-type`"
          size="small"
          v-model="model.type"
          :options="[
            { label: '텍스트', value: 'text' },
            { label: '셀렉트', value: 'select' },
            { label: '라디오', value: 'radio' },
            { label: '체크박스', value: 'checkbox' },
            { label: '스위치', value: 'switch' },
          ]"
          placeholder="항목의 타입"/>
      </Label>
    </Labels>
    <div v-if="_visibleValues" class="body-items">
      <label :for="`article-data-${props.idx}-values`" class="label-text first">
        항목
      </label>
      <FormTag
        :id="`article-data-${props.idx}-values`"
        v-model="model.values"
        :limit="16"
        placeholder="항목 값"
        class="manage-values"/>
    </div>
    <Labels>
      <Label>
        <span class="label-text first">기본값</span>
        <FormInput
          :id="`article-data-${props.idx}-default`"
          v-model="model.default"
          size="small"
          placeholder="기본값"
          style="width:240px"/>
      </Label>
    </Labels>
  </div>
  <nav class="remove">
    <ButtonIcon
      type="button"
      title="항목삭제"
      icon-name="trash-2"
      size="small"
      color="error"
      @click="emits('remove', props.idx)"/>
  </nav>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { pureObject } from '@/libs/object.js'
import { ButtonBasic, ButtonIcon } from '@/components/button'
import { FormInput, FormSelect, FormTag } from '@/components/forms'
import { Fieldset, Field, Help, Labels, Label } from '@/components/forms/fieldset'

const props = defineProps({
  idx: Number,
})
const model = defineModel()
const emits = defineEmits([ 'remove' ])

const _visibleValues = computed(() => {
  switch (model.value.type)
  {
    case '':
    case 'text':
      return false
    default:
      return true
  }
})
</script>

<style src="./item.scss" lang="scss" scoped></style>
