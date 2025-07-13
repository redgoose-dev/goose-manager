<template>
<Loading v-if="state.loading"/>
<article v-else-if="data.article" class="article">
  <header class="header">
    <small>
      <router-link
        v-if="data.nest"
        :to="`/nest/${data.nest.srl}/article/`"
        title="둥지">
        {{data.nest.name}}
      </router-link>
      <router-link
        v-if="data.category"
        :to="`../?category=${data.category.srl}`"
        title="카테고리">
        {{data.category.name}}
      </router-link>
    </small>
    <h1>{{data.article.title}}</h1>
    <p>
      <span v-if="_mode">{{_mode}}</span>
      <span v-if="_date">등록일: {{_date}}</span>
      <span v-if="_regdate">정렬날짜: {{_regdate}}</span>
      <span>조회수: {{data.article?.hit || 0}}</span>
      <span>좋아요: {{data.article?.star || 0}}</span>
    </p>
  </header>
  <div class="content">
    <div ref="$content" v-html="data.article.content" class="content-body redgoose-body"/>
  </div>
  <section v-if="data.tag?.length > 0" class="tags">
    <h1>태그</h1>
    <ul>
      <li v-for="o in data.tag">
        <Tag
          :label="o.name"
          color="key"
          :use-click="true"
          @click="onClickTag(o.srl)"/>
      </li>
    </ul>
  </section>
  <Controller>
    <template #left>
      <ButtonGroup>
        <ButtonBasic href="../" icon-left="list">
          목록
        </ButtonBasic>
        <ButtonBasic
          v-if="data.article?.countFile > 0"
          icon-left="file-search"
          color="code"
          @click="state.file = true">
          {{data.article.countFile}}개의 첨부파일
        </ButtonBasic>
      </ButtonGroup>
    </template>
    <template #right>
      <ButtonGroup>
        <ButtonBasic v-if="_fromNest" href="./change-nest/" icon-left="package">
          둥지변경
        </ButtonBasic>
        <ButtonBasic href="./edit/" icon-left="edit">
          수정
        </ButtonBasic>
        <ButtonBasic href="./delete/" color="error" icon-left="trash-2">
          삭제
        </ButtonBasic>
      </ButtonGroup>
    </template>
  </Controller>
  <div class="comment-content">
    <Comments
      v-if="_useComment"
      title="아티클 댓글"
      module="article"
      :module-srl="props.srl"/>
  </div>
</article>
<Empty v-else title="Not found article."/>
<teleport to="#modals">
  <Modal
    :open="state.file"
    mode="full"
    :shortcut="true"
    :scroll="true"
    @close="state.file = false">
    <Files
      title="아티클 첨부파일"
      module="article"
      :module-srl="props.srl"
      :private="_private"
      @close="state.file = false"/>
  </Modal>
  <Lightbox
    :src="state.previewImage"
    :private="_private"
    @close="state.previewImage = ''"/>
</teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from '../../../structure/article/detail.js'
import { dateFormat } from '../../../libs/date.js'
import { Controller } from '../../navigation/index.js'
import { ButtonGroup, ButtonBasic } from '../../button/index.js'
import { Loading, Empty, Lightbox, Files } from '../../content/index.js'
import { Tag } from '../../item/index.js'
import { Modal } from '../../modal/index.js'
import Comments from '../../content/comment/index.vue'

const props = defineProps({
  nestSrl: Number,
  srl: Number,
})
const router = useRouter()
const auth = inject('auth')
const error = inject('error')
const errorPath = [ 'components', 'pages', 'article', 'detail.vue' ]
const $content = ref()
const data = reactive({
  nest: null,
  article: null,
  tag: null,
  category: null,
})
const state = reactive({
  loading: true,
  previewImage: '',
  fileWindow: false,
  fileIndex: [],
})

const _fromNest = computed(() => (props.nestSrl > 0))
const _mode = computed(() => {
  if (!data.article?.mode) return ''
  switch (data.article.mode)
  {
    case 'private': return '비공개'
    case 'public': return '공개'
    default: return ''
  }
})
const _date = computed(() => {
  if (!data.article?.createdAt) return null
  return dateFormat(new Date(data.article.createdAt), '{yyyy}-{MM}-{dd}')
})
const _regdate = computed(() => {
  if (!data.article?.regdate) return null
  return dateFormat(new Date(data.article.regdate), '{yyyy}-{MM}-{dd}')
})
const _useComment = computed(() => (Number(data.nest?.json?.useComment) === 1))
const _private = computed(() => (data.article?.mode === 'private'))

onMounted(async () => {
  try
  {
    const res = await getData(props.srl, _fromNest.value)
    data.nest = res.nest
    data.article = res.article
    data.tag = res.tag
    data.category = res.category
    state.loading = false
    await nextTick()
    initContentEvents()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '아티클 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
    state.loading = false
  }
})

function initContentEvents()
{
  $content.value.querySelectorAll('img').forEach(el => {
    el.addEventListener('click', e => {
      state.previewImage = e.currentTarget.src
    })
  })
}

function onClickTag(srl)
{
  router.push(`../?tag=${srl}`).then()
}
</script>

<style src="./detail.scss" lang="scss" scoped></style>
