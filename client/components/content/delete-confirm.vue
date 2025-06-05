<template>
<article class="delete-confirm">
  <div class="wrap">
    <h2 class="title">{{props.title}}</h2>
    <p class="description">{{props.description}}</p>
    <p class="name">
      <span>삭제되는 요소:</span>
      <em>{{props.name}}</em>
    </p>
  </div>
  <Controller>
    <template #left>
      <ButtonBasic
        type="button"
        icon-left="arrow-left"
        @click="emits('cancel')">
        뒤로가기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="button"
        color="key"
        :icon-left="props.processing ? 'loader' : 'check'"
        :rotate-icon="props.processing"
        :disabled="props.processing"
        @click="emits('submit')">
        {{props.buttonLabel}}
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { Controller } from '../navigation/index.js'
import { ButtonBasic } from '../button/index.js'

const props = defineProps({
  title: String,
  description: String,
  name: String,
  buttonLabel: { type: String, default: '삭제하기' },
  processing: Boolean,
})
const emits = defineEmits([ 'cancel', 'submit' ])
</script>

<style src="./delete-confirm.scss" lang="scss" scoped></style>
