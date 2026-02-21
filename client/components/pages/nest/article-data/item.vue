<template>
<div class="item">
  <ButtonIcon
    type="label"
    title="항목 순서변경"
    icon-name="move"
    size="small"
    color="transparent"
    class="move"/>
  <div class="body">
    <Labels>
      <Label>
        <span class="label-text first">* 이름</span>
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
          :options="typeOptions"
          placeholder=""
          @update:model-value="onChangeType"/>
      </Label>
    </Labels>
    <div v-if="_visibleValues" class="body-items">
      <label :for="`article-data-${props.idx}-values`" class="label-text first">
        항목
      </label>
      <FormTag
        :id="`article-data-${props.idx}-values`"
        v-model="model.values"
        :limit="12"
        placeholder="항목 값"
        class="manage-values"/>
    </div>
    <Labels>
      <Label class="default">
        <span class="label-text first">기본값</span>
        <template v-if="_isMultipleType">
          <FormSelect
            v-if="_valuesOptions.length"
            v-model="model.default"
            :options="_valuesOptions"
            size="small"
            placeholder="값을 선택해주세요."
            @update:model-value="model.default = $event"/>
          <em v-else class="default--empty">항목이 없습니다.</em>
        </template>
        <FormSwitch
          v-else-if="_isSwitchType"
          :id="`article-data-${props.idx}-default`"
          v-model="model.default"
          class="default--switch"/>
        <FormInput
          v-else
          :id="`article-data-${props.idx}-default`"
          v-model="model.default"
          size="small"
          placeholder="기본값"
          class="default--text"
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
import { ref, computed } from 'vue'
import { ButtonIcon } from '@/components/button'
import { FormInput, FormSelect, FormSwitch, FormTag } from '@/components/forms'
import { Labels, Label } from '@/components/forms/fieldset'

const props = defineProps({
  idx: Number,
})
/**
 * model property
 * @property string name
 * @property string type (text,radio,checkbox,select,switch)
 * @property string values
 * @property string default
 */
const model = defineModel()
const emits = defineEmits([ 'remove' ])
const typeOptions = ref([
  { label: '텍스트', value: 'text' },
  { label: '라디오', value: 'radio' },
  { label: '체크박스', value: 'checkbox' },
  { label: '셀렉트', value: 'select' },
  { label: '스위치', value: 'switch' },
])

const _valuesOptions = computed(() => {
  return (model.value.values?.split(',') || [])
    .filter(Boolean)
    .map(o => ({ label: o, value: o }))
})
const _visibleValues = computed(() => {
  switch (model.value.type)
  {
    case '':
    case 'text':
    case 'switch':
      return false
    default:
      return true
  }
})
const _isSwitchType = computed(() => {
  return model.value.type === 'switch'
})
const _isMultipleType = computed(() => {
  return [ 'checkbox', 'radio', 'select' ].includes(model.value.type)
})

function onChangeType(type)
{
  switch (type)
  {
    case 'switch':
      model.value.default = Boolean(model.value.default)
      break
    default:
      model.value.default = ''
      break
  }
}
</script>

<style src="./item.scss" lang="scss" scoped></style>
