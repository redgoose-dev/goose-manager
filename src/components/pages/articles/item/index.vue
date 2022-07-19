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
      <span>regdate: {{data.article.regdate}}</span>
      <span v-if="data.article.order">order: {{data.article.order}}</span>
      <span>hit: {{data.article.hit}}</span>
      <span>star: {{data.article.star}}</span>
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
        Index
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        v-if="props.nestSrl"
        type="button"
        :href="`../create/${createQueries(['category'], route.query)}`"
        color="key"
        icon-left="plus">
        Create
      </ButtonBasic>
      <ButtonBasic href="./change-nest/">
        Change nest
      </ButtonBasic>
      <ButtonBasic
        :href="`./edit/${createQueries(['category','page'], route.query)}`"
        color="weak"
        icon-left="edit-3">
        Edit
      </ButtonBasic>
      <ButtonBasic
        :href="`./delete/${createQueries(['category','page'], route.query)}`"
        color="error"
        icon-left="trash">
        Delete
      </ButtonBasic>
    </template>
  </Controller>
  <Comments
    v-if="useComments"
    :article-srl="props.srl"
    class="article__comments"/>
  <teleport to="#modals">
    <Modal :show="!!previewImage" @close="previewImage = null">
      <ModalBody>
        <PreviewImage :src="previewImage" @close="previewImage = null"/>
      </ModalBody>
    </Modal>
  </teleport>
</article>
<Loading v-else class="loading"/>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, nextTick, DefineComponent } from 'vue'
import { useRoute } from 'vue-router'
import getData from '../../../../structure/articles/item'
import { err } from '../../../../libs/error'
import { createQueries } from '../libs'
import Loading from '../../../etc/loading.vue'
import { Controller } from '../../../navigation'
import { Modal, ModalBody } from '../../../modal'
import { ButtonBasic } from '../../../button'
import Files from './files.vue'
import Comments from './comments.vue'
import PreviewImage from './preview-image.vue'

interface Data {
  article: any
  nest: any
  files: any
}

const route = useRoute()
const $content = ref<DefineComponent>()
const props = defineProps<{
  srl: number
  nestSrl?: number
}>()
const data = reactive<Data>({
  article: undefined,
  nest: undefined,
  files: undefined,
})
const loading = ref<boolean>(true)
const previewImage = ref<string>('')
const useComments = computed<boolean>(() => (Number(data.nest.json.useComment) === 1))

function initContentEvents()
{
  $content.value?.querySelectorAll('img').forEach((el: HTMLElement) => {
    el.addEventListener('click', (e: any) => {
      previewImage.value = e.currentTarget.src
    })
  })
}

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
  catch (e: any)
  {
    err(['/components/pages/articles/item/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
