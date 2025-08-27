<template>
<form @submit.prevent="onSubmit">
  <header class="content-header">
    <div class="body">
      <h1>Navigation</h1>
      <p>관리자 메뉴에서 사용되는 데이터입니다.</p>
    </div>
    <nav class="action">
      <ButtonBasic
        type="button"
        icon-left="bird"
        size="small"
        color="sub"
        @click="state.iconPreview = true">
        아이콘
      </ButtonBasic>
    </nav>
  </header>
  <div class="json-content">
    <Editor ref="$editor" v-model="forms.json"/>
  </div>
  <Controller>
    <template #left>
      <ButtonBasic
        type="button"
        :disabled="state.processing"
        :icon-left="state.processing ? 'loader' : 'rotate-ccw'"
        :rotate-icon="state.processing"
        @click="onClickReset">
        초기화
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :disabled="state.processing"
        :icon-left="state.processing ? 'loader' : 'check'"
        :rotate-icon="state.processing">
        업데이트
      </ButtonBasic>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      :open="state.iconPreview"
      :scroll="true"
      :shortcut="true"
      class="modal-icon-preview"
      @close="state.iconPreview = false">
      <ModalWindow :scroll="false" class="content-icon-preview">
        <ModalHeader
          title="아이콘 프리뷰"
          @close="state.iconPreview = false"/>
        <div class="content-icon-preview__body">
          <IconPreview/>
        </div>
      </ModalWindow>
    </Modal>
  </teleport>
</form>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import Editor from '../../components/pages/json/editor.vue'
import { Controller } from '../../components/navigation/index.js'
import { ButtonBasic } from '../../components/button/index.js'
import { Modal, ModalWindow, ModalHeader } from '../../components/modal/index.js'
import IconPreview from '../../components/icon/preview.vue'

const keyName = 'navigation'
const preference = inject('preference')
const error = inject('error')
const errorPath = [ 'pages', 'preference', 'basic.vue' ]
const toast = inject('toast')
const $editor = ref()
const state = reactive({
  processing: false,
  iconPreview: false,
})
const forms = reactive({
  json: JSON.stringify(preference._pure[keyName]),
})

async function onSubmit()
{
  try
  {
    state.processing = true
    await preference.update(keyName, JSON.parse(forms.json))
    toast.add('설정 업데이트 완료', 'success').then()
  }
  catch(e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: '설정을 업데이트 실패',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}

async function onClickReset()
{
  try
  {
    state.processing = true
    const res = await preference.getDefault(keyName)
    forms.json = JSON.stringify(res, null, 2)
    if ($editor.value?.$editor)
    {
      $editor.value.$editor.updateData(forms.json, true)
    }
  }
  catch(e)
  {
    error.catch({
      path: [ ...errorPath, 'onClickReset()' ],
      message: '설정을 초기화하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style lang="scss" scoped>
@use '../../scss/mixins';
@forward './content.scss';
.modal-icon-preview {
  --modal-window-width: calc(100dvw - (var(--size-side-padding) * 2));
  --modal-window-max-width: var(--size-content-body);
  --modal-window-max-height: 65dvh;
  @include mixins.responsive(tablet) {}
}
.content-icon-preview {
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: 2px;
  &__body {
    padding: 16px;
    overflow: auto;
    @include mixins.custom-scrollbar();
  }
  @include mixins.responsive(tablet) {
    &__body {
      padding: 16px;
    }
  }
  @include mixins.responsive(desktop) {
    &__body {
      padding: 36px;
    }
  }
}
</style>
