<template>
<article v-if="!loading" class="article">
  <header class="article__header">
    <small>
      <span v-if="data.nest.name">{{data.nest.name}}</span>
      <span v-if="data.article.categoryName">{{data.article.categoryName}}</span>
    </small>
    <h1>{{data.article.title}}</h1>
    <p>
      <span>{{data.article.type}}</span>
      <span>등록일: {{data.article.regdate}}</span>
      <span v-if="data.article.order">정렬날짜: {{data.article.order}}</span>
      <span>조회수: {{data.article.hit}}</span>
      <span>좋아요: {{data.article.star}}</span>
    </p>
  </header>
  <div class="article__body">
    <div ref="$content" v-html="data.article.content" class="redgoose-body redgoose-body--dark"/>
  </div>
  <Files
    v-if="data.files?.length > 0"
    :items="data.files"
    class="article__files"/>
  <Controller>
    <template #left>
      <ButtonBasic
        type="button"
        :href="`../${createQueries(['category','page'], route.query)}`"
        icon-left="list">
        목록
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic
          v-if="props.nestSrl"
          type="button"
          :href="`../create/${createQueries(['category'], route.query)}`"
          color="key"
          icon-left="plus">
          만들기
        </ButtonBasic>
        <ButtonBasic href="./change-nest/">
          둥지변경
        </ButtonBasic>
        <ButtonBasic
          :href="`./edit/${createQueries(['category','page'], route.query)}`"
          color="weak"
          icon-left="edit-3">
          수정
        </ButtonBasic>
        <ButtonBasic
          :href="`./delete/${createQueries(['category','page'], route.query)}`"
          color="error"
          icon-left="trash">
          삭제
        </ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
  <Comments
    v-if="useComments"
    :article-srl="props.srl"
    class="article__comments"/>
  <teleport to="#modals">
    <Modal :show="!!previewImage" @close="previewImage = ''">
      <ModalBody>
        <PreviewImage :src="previewImage" @close="previewImage = ''"/>
      </ModalBody>
    </Modal>
  </teleport>
</article>
<Loading v-else class="loading"/>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import getData from '../../../../structure/articles/item'
import { err } from '../../../../libs/error'
import { createQueries } from '../libs'
import Loading from '../../../etc/loading.vue'
import { Controller } from '../../../navigation'
import { Modal, ModalBody } from '../../../modal'
import { ButtonBasic, ButtonGroup } from '../../../button'
import Files from './files.vue'
import Comments from './comments.vue'
import PreviewImage from './preview-image.vue'

const route = useRoute()
const $content = ref()
const props = defineProps({
  srl: { type: Number, required: true },
  nestSrl: Number,
})
const data = reactive({
  article: undefined,
  nest: undefined,
  files: undefined,
})
const loading = ref(true)
const previewImage = ref('')
const useComments = computed(() => (Number(data.nest.json.useComment) === 1))

onMounted(async () => {
  try
  {
    let { article, nest, files } = await getData(props.srl, !props.nestSrl)
    data.article = article
    data.nest = nest
    data.files = files
    loading.value = false
    await nextTick()
    initContentEvents()
  }
  catch (e)
  {
    err(['/components/pages/articles/item/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})

function initContentEvents()
{
  $content.value?.querySelectorAll('img').forEach(el => {
    el.addEventListener('click', e => {
      previewImage.value = e.currentTarget.src
    })
  })
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
