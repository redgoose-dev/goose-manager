<template>
<div class="filter">
  <ButtonBasic
    type="button"
    size="small"
    icon-left="server">
    목록옵션
  </ButtonBasic>
  <fieldset class="controller">
    <legend>목록옵션 컨트롤러</legend>
    <div class="controller__body">
      <section>
        <h4>그룹 사용</h4>
        <ButtonGroup>
          <ButtonBasic
            type="button"
            size="small"
            :color="localStore.attachmentGroup === 'type' ? 'key' : ''"
            @click="onChangeGroup('type')">
            파일종류
          </ButtonBasic>
          <ButtonBasic
            type="button"
            size="small"
            :color="localStore.attachmentGroup === 'size' ? 'key' : ''"
            @click="onChangeGroup('size')">
            파일용량
          </ButtonBasic>
          <ButtonBasic
            type="button"
            size="small"
            :color="localStore.attachmentGroup === 'imageSize' ? 'key' : ''"
            @click="onChangeGroup('imageSize')">
            이미지 크기
          </ButtonBasic>
        </ButtonGroup>
      </section>
      <section>
        <h4>목록 표시형태</h4>
        <ButtonGroup>
          <ButtonBasic
            type="button"
            size="small"
            :color="localStore.attachmentTheme === 'thumbnail' ? 'key' : ''"
            icon-left="grid"
            @click="onChangeIndexType('thumbnail')">
            썸네일
          </ButtonBasic>
          <ButtonBasic
            type="button"
            size="small"
            :color="localStore.attachmentTheme === 'list' ? 'key' : ''"
            icon-left="server"
            @click="onChangeIndexType('list')">
            목록
          </ButtonBasic>
        </ButtonGroup>
      </section>
      <section>
        <h4>이미지 보기</h4>
        <FormSwitch
          size="small"
          :modelValue="localStore.attachmentDisplayImage"
          @update:modelValue="onChangeDisplayImage"/>
      </section>
    </div>
  </fieldset>
</div>
</template>

<script setup>
import { fileManagerStore } from '../../store'
import { ButtonBasic, ButtonGroup } from '../../../button'
import { FormSwitch } from '../../../forms/index.js'

const localStore = fileManagerStore()

function onChangeGroup(value)
{
  localStore.changeGroup(value)
}
function onChangeIndexType(value)
{
  localStore.changeAttachmentTheme(value)
}
function onChangeDisplayImage(sw)
{
  localStore.changeAttachmentDisplayImage(sw)
}
</script>

<style src="./index-filter.scss" lang="scss" scoped></style>
