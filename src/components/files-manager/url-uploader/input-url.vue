<template>
<fieldset class="input-url">
  <legend>URL 주소 입력</legend>
  <FormTextarea
    v-model="address"
    name="address"
    :rows="12"
    placeholder="https://example.com/example-image.jpg"
    :required="true"
    @submit="emits('submit')"/>
  <Help>
    파일 여러개를 업로드 하려면 줄바꿈을 이용하여 주소를 입력합니다.
  </Help>
</fieldset>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FormTextarea } from '../../forms'
import { Help } from '../../forms/fieldset'

const mockupUrl = 'https://goose.redgoose.me/data/upload/original/202211/infra-structure.webp\n' +
  'https://goose.redgoose.me/data/upload/original/202301/eye-test-001.jpg\n' +
  'https://goose.redgoose.me/data/upload/original/202205/scan-works-008.webp\n' +
  'https://goose.redgoose.me/data/upload/original/202003/the-war-of-genesis-3-002.jpg\n'
const emits = defineEmits([ 'submit' ])
const address = ref<string>(mockupUrl)
</script>

<style src="./input-url.scss" lang="scss" scoped></style>
