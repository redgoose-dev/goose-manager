<template>
<article class="confirm">
  <div class="confirm__body">
    <h2 class="confirm__title">{{props.title}}</h2>
    <p class="confirm__description">{{props.description}}</p>
    <p class="confirm__name">{{props.name}}</p>
  </div>
  <Controller>
    <template #left>
      <ButtonBasic type="button" icon-left="arrow-left" @click="emits('cancel')">
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

<script lang="ts" setup>
import { Controller } from '../../navigation'
import { ButtonBasic } from '../../button'

const props = defineProps<{
  title: string
  description: string
  name: string
  buttonLabel: string
  processing: boolean
}>()
const emits = defineEmits([ 'cancel', 'submit' ])
</script>

<style src="./index.scss" lang="scss" scoped></style>
