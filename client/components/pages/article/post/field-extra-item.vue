<template>
<dt><label :for="_id">{{props.resource.name}}</label></dt>
<dd>
  <div v-if="_type === 'text'" class="field--text">
    <FormInput
      :id="_id"
      v-model="itemValue"
      size="small"/>
  </div>
  <div v-else-if="_type === 'checkbox'" class="field--checkbox">
    <Labels>
      <Label v-for="(o,k) in _values">
        <FormCheckbox
          :model-value="_valuesForCheckbox[k]"
          :id="k === 0 ? _id : ''"
          :name="_id"
          size="small"
          @update:model-value="onUpdateCheckbox(o.value, $event)"/>
        <span>{{o.label}}</span>
      </Label>
    </Labels>
  </div>
  <div v-else-if="_type === 'radio'" class="field--radio">
    <Labels>
      <Label v-for="(o,k) in _values">
        <FormRadio
          v-model="itemValue"
          :id="k === 0 ? _id : ''"
          :name="_id"
          :value="o.value"
          size="small"/>
        <span>{{o.label}}</span>
      </Label>
    </Labels>
  </div>
  <div v-else-if="_type === 'select'" class="field--select">
    <FormSelect
      :id="_id"
      v-model="itemValue"
      :options="_values"
      placeholder="항목을 선택하세요."
      size="small"/>
  </div>
  <div v-else-if="_type === 'switch'" class="field--switch">
    <FormSwitch :id="_id" v-model="itemValue"/>
  </div>
</dd>
</template>

<script setup>
import { computed } from 'vue'
import { FormInput, FormSwitch, FormSelect, FormCheckbox, FormRadio } from '@/components/forms'
import { Labels, Label } from '@/components/forms/fieldset'

const props = defineProps({
  resource: Object,
  idx: Number,
})
const itemValue = defineModel('value')

const _id = computed(() => (`extra-${props.idx}`))
const _type = computed(() => props.resource.type)
const _values = computed(() => {
  if (!props.resource.values) return []
  return props.resource.values.split(',').map(o => ({ value: o, label: o }))
})
const _valuesForCheckbox = computed(() => {
  if (!props.resource.values) return []
  const _values = itemValue.value?.split(',') || []
  return props.resource.values.split(',').map(item => (_values.includes(item)))
})

function onUpdateCheckbox(value, checked)
{
  const _itemValue = itemValue.value.split(',')
  itemValue.value = props.resource.values.split(',').map(o => {
    if (o === value)
    {
      if (checked) return o
    }
    else
    {
      if (_itemValue.includes(o)) return o
    }
    return false
  }).filter(Boolean).join(',')
}
</script>

<style src="./field-extra-item.scss" lang="scss" scoped></style>
