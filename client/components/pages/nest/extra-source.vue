<template>
<Modal
  :open="open"
  class="extra-source"
  @close="emits('close')">
  <ModalWindow class="window">
    <ModalHeader
      title="엑스트라 소스코드 편집"
      @close="emits('close')"/>
    <div class="body">
      <FormTextarea
        v-model:content="source"
        placeholder="{}"
        class="input-source"/>
    </div>
    <nav class="submit">
      <ButtonGroup>
        <ButtonBasic
          icon-left="x"
          @click="emits('close')">
          닫기
        </ButtonBasic>
        <ButtonBasic
          color="key"
          icon-left="check"
          @click="onSubmit">
          적용하기
        </ButtonBasic>
      </ButtonGroup>
    </nav>
  </ModalWindow>
</Modal>
</template>

<script setup>
import { Modal, ModalHeader, ModalWindow } from '@/components/modal/index.js'
import { FormTextarea } from '@/components/forms/index.js'
import { ButtonGroup, ButtonBasic } from '@/components/button/index.js'

const open = defineModel('open', { default: false })
const source = defineModel('src', { default: '{}' })
const emits = defineEmits([ 'update', 'close' ])

function onSubmit()
{
  emits('update', JSON.parse(source.value))
}
</script>

<style lang="scss" scoped>
@import '../../../scss/mixins';
.extra-source {
  --modal-window-width: calc(100dvw - (var(--size-side-padding) * 2));
  --modal-window-max-width: var(--size-content-body);
  --modal-window-height: 68dvh;
}
.window {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.body {
  padding: 30px 30px 0;
  box-sizing: border-box;
}
.input-source {
  height: 100%;
}
.submit {
  display: grid;
  justify-content: center;
  padding: 16px 0 32px;
}
</style>
