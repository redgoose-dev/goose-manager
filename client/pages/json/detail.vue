<template>
<article>
  <PageHeader module="json" title="Detail JSON"/>
  <Loading v-if="state.loading"/>
  <template v-else-if="_item">
    <Fieldset>
      <Field label="번호">{{_item.srl}}</Field>
      <Field label="이름"><strong>{{_item.name}}</strong></Field>
      <Field v-if="_item.description" label="설명">{{_item.description}}</Field>
      <Field v-if="_item.category" label="분류">
        <router-link :to="`../?category=${_item.categorySrl}`">{{_item.category}}</router-link>
      </Field>
      <Field label="만든 날짜">{{_item.date}}</Field>
    </Fieldset>
    <Editor
      :model-value="_json"
      :readonly="true"
      class="json"/>
    <Fieldset>
      <Field v-if="_item.tag?.length > 0" label="태그">
        <ul class="tags">
          <li v-for="o in _item.tag">
            <Tag
              :label="o.name"
              color="key"
              :use-click="true"
              @click="onClickTag(o.srl)"/>
          </li>
        </ul>
      </Field>
      <Field v-if="_item.file?.length > 0" label="첨부파일">
        <nav class="attachment-button">
          <ButtonBasic
            size="small"
            color="base"
            icon-left="file-search"
            @click="state.filesWindow = true">
            총 {{_item.file.length}}개의 첨부파일 열람
          </ButtonBasic>
        </nav>
      </Field>
    </Fieldset>
  </template>
  <Empty v-else title="No data"/>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="list">목록</ButtonBasic>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic href="./edit/" icon-left="edit" color="key">수정</ButtonBasic>
        <ButtonBasic href="./delete/" icon-left="trash-2" color="error">삭제</ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      :open="state.filesWindow"
      mode="full"
      :shortcut="true"
      :scroll="true"
      @close="state.filesWindow = false">
      <Files
        title="JSON 첨부파일"
        :items="_item.file"
        :private="false"
        @close="state.filesWindow = false"/>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getData } from '../../structure/json/detail.js'
import { dateFormat } from '../../libs/date.js'
import PageHeader from '../../components/header/page.vue'
import { Loading, Empty, Files } from '../../components/content/index.js'
import { Fieldset, Field } from '../../components/forms/fieldset/index.js'
import { Controller } from '../../components/navigation/index.js'
import { ButtonBasic, ButtonGroup } from '../../components/button/index.js'
import { Tag } from '../../components/item/index.js'
import Editor from '../../components/pages/json/editor.vue'
import { Modal } from '../../components/modal/index.js'

const router = useRouter()
const route = useRoute()
const error = inject('error')
const errorPath = [ 'pages', 'json', 'detail.vue' ]
const $jsonEditor = ref()
const state = reactive({
  loading: true,
  data: null,
  jsonMode: 'editor', // editor,source
  filesWindow: false,
})

const _item = computed(() => {
  if (!state.data) return {}
  return {
    srl: state.data.srl,
    name: state.data.name,
    description: state.data.description,
    category: state.data.category,
    categorySrl: state.data.categorySrl,
    date: dateFormat(new Date(state.data.date), '{yyyy}년 {month} {dd}일 ({weekShort}), {hh}시 {mm}분'),
    tag: state.data.tag,
    file: state.data.file,
  }
})
const _json = computed(() => {
  if (!state.data.json) return '{}'
  return JSON.stringify(state.data.json, null, 2)
})
const _editorMode = computed(() => (state.jsonMode === 'editor'))

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('srl 값이 없습니다.')
    state.data = await getData(route.params.srl)
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: 'JSON 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})

function onClickTag(srl)
{
  router.push(`../?tag=${srl}`).then()
}
</script>

<style src="./detail.scss" lang="scss" scoped></style>
