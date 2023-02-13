<template>
<nav class="tab">
  <div>
    <ButtonBasic
      size="small"
      :color="props.modelValue === '' ? 'key' : ''"
      :class="[
        'tab__button',
        props.modelValue === '' && 'on',
      ]"
      @click="onClickButton('')">
      URL 주소
    </ButtonBasic>
  </div>
  <div>
    <ButtonBasic
      size="small"
      :color="props.modelValue === 'verify' ? 'key' : ''"
      :class="[
        'tab__button',
        props.modelValue === 'verify' && 'on',
      ]"
      @click="onClickButton('verify')">
      파일검증
    </ButtonBasic>
  </div>
</nav>
</template>

<script lang="ts" setup>
import { ButtonBasic } from '../../button'

const props = defineProps<{
  modelValue: '' | 'verify'
}>()
const emits = defineEmits([ 'update:modelValue' ])

function onClickButton(key: string): void
{
  if (props.modelValue === key) return
  emits('update:modelValue', key)
}
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  justify-content: flex-start;
  gap: 6px;
  &__button {
    &.on {
      cursor: default;
    }
  }
}
</style>
