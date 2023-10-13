<template>
<div class="control-theme">
  <ButtonGroup>
    <ButtonBasic
      type="button"
      size="small"
      :color="localStore.attachmentTheme === 'thumbnail' ? 'key' : ''"
      icon-left="grid"
      @click="onChangeTheme('thumbnail')">
      썸네일
    </ButtonBasic>
    <ButtonBasic
      type="button"
      size="small"
      :color="localStore.attachmentTheme === 'list' ? 'key' : ''"
      icon-left="server"
      @click="onChangeTheme('list')">
      목록
    </ButtonBasic>
  </ButtonGroup>
  <label class="display-image">
    <strong>이미지</strong>
    <FormSwitch
      size="small"
      :modelValue="localStore.attachmentDisplayImage"
      @update:modelValue="onChangeDisplayImage"/>
  </label>
</div>
</template>

<script setup>
import { fileManagerStore } from '../../../../store/files-manager'
import { ButtonBasic, ButtonGroup } from '../../../button'
import { FormSwitch } from '../../../forms/index.js'

const emits = defineEmits([ 'update:modelValue' ])
const localStore = fileManagerStore()

function onChangeTheme(value)
{
  localStore.changeAttachmentTheme(value)
}
function onChangeDisplayImage(sw)
{
  localStore.changeAttachmentDisplayImage(sw)
}
</script>

<style lang="scss" scoped>
.control-theme {
  display: flex;
  align-items: center;
  gap: 12px;
}
.display-image {
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  --switch-width: 36px;
  --switch-height: 20px;
  --switch-padding: 4px;
  strong {
    display: block;
    font-size: 10px;
    line-height: 1.15;
  }
}
</style>
