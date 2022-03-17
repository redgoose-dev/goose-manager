<template>
<article class="confirm">
  <div class="confirm__body">
    <h1 class="confirm__title">{{props.title}}</h1>
    <p class="confirm__description">{{props.description}}</p>
    <p class="confirm__name">{{props.name}}</p>
  </div>
  <Controller>
    <template #left>
      <ButtonBasic icon-left="arrow-left" @click="emits('cancel')">
        Back
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
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
import { Controller } from '../../navigation';
import ButtonBasic from '../../button/basic.vue';

const props = defineProps({
  title: String,
  description: String,
  name: String,
  buttonLabel: String,
  processing: Boolean,
});
const emits = defineEmits([ 'cancel', 'submit' ]);
</script>

<style src="./index.scss" lang="scss" scoped></style>
