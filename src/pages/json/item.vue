<template>
<article>
  <PageHeader module="json" :title="`JSON / ${item.name}`"/>
  <Loading v-if="loading"/>
  <Fieldset v-else tag="section">
    <Field label="번호">{{item.srl}}</Field>
    <Field label="이름"><strong>{{item.name}}</strong></Field>
    <Field label="설명">{{item.description}}</Field>
    <Field v-if="item.categoryName" label="분류이름">{{item.categoryName}}</Field>
    <div class="json-content">
      <ToolbarWrap>
        <template #left>
          <ToolbarGroup>
            <ToolbarItem
              type="button"
              title="Expand"
              label="모두 펼치기"
              icon="plus-square"
              @click="onClickFold(false)"/>
            <ToolbarItem
              type="button"
              title="Fold"
              label="접기"
              icon="minus-square"
              @click="onClickFold(true)"/>
          </ToolbarGroup>
        </template>
        <template #right>
          <ToolbarGroup>
            <ToolbarItem
              type="button"
              title="Editor style"
              label="에디터 스타일"
              icon="server"
              :color="mode === 'editor' ? 'key' : ''"
              :disabled="mode === 'editor'"
              @click="changeMode('editor')"/>
            <ToolbarItem
              type="button"
              title="Source code style"
              label="소스코드 스타일"
              icon="code"
              :color="mode === 'source' ? 'key' : ''"
              :disabled="mode === 'source'"
              @click="changeMode('source')"/>
          </ToolbarGroup>
        </template>
      </ToolbarWrap>
      <div class="json-content__body">
        <JsonEditor
          v-if="mode === 'editor'"
          ref="$jsonEditor"
          :model-value="json"
          edit="none"
          @init="onInitJsonEditor"/>
        <pre v-if="mode === 'source'" class="json-code"><code>{{json}}</code></pre>
      </div>
    </div>
    <Field v-if="!!item.path" label="URL주소" class="path">
      <a v-if="isPathLink" :href="item.path" target="_blank">{{item.path}}</a>
      <template v-else>{{item.path}}</template>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="list">
        목록
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic href="./edit/" icon-left="edit">
          수정
        </ButtonBasic>
        <ButtonBasic href="./delete/" color="key" icon-left="trash">
          삭제
        </ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { err } from '../../libs/error'
import getData from '../../structure/json/item'
import PageHeader from '../../components/page/header/index.vue'
import { Fieldset, Field } from '../../components/forms/fieldset'
import { Controller } from '../../components/navigation'
import { ButtonBasic, ButtonGroup } from '../../components/button'
import Loading from '../../components/etc/loading.vue'
import JsonEditor from '../../components/json-editor/index.vue'
import { ToolbarWrap, ToolbarGroup, ToolbarItem } from '../../components/navigation/toolbar'

const $jsonEditor = ref()
const route = useRoute()
const loading = ref(true)
const mode = ref('editor') // editor,source
const item = ref({})
const json = computed(() => {
  return JSON.stringify(item.value.json, null, 2)
})
const isPathLink = computed(() => {
  if (!item.value.path) return false
  return /^http/.test(item.value.path)
})

function changeMode(newValue)
{
  mode.value = newValue
}

function onInitJsonEditor(instance)
{
  $jsonEditor.value.expandFolder(2)
}

function onClickFold(sw)
{
  $jsonEditor.value.foldAll(sw)
}

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('no srl')
    loading.value = true
    item.value = await getData()
    loading.value = false
  }
  catch (e)
  {
    err([ '/pages/json/item.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./item.scss" lang="scss" scoped></style>
