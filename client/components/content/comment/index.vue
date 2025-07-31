<template>
<section>
  <header class="header">
    <h1>댓글</h1>
    <p><strong>{{state.index.length}}</strong>개의 댓글이 달렸습니다.</p>
  </header>
  <Loading v-if="state.loading"/>
  <ul v-else-if="state.index?.length > 0" class="index">
    <li v-for="(o,k) in state.index">
      <Item
        :srl="o.srl"
        :content="o.content"
        :regdate="o.regdate"
        @edit="content => onEditComment(k, content)"
        @delete="onDeleteComment(k)"/>
    </li>
  </ul>
  <Create
    :module="props.module"
    :module-srl="props.moduleSrl"
    class="create"
    @submit="onSubmitCreate"/>
</section>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { getData } from '../../../structure/comment/index.js'
import { Loading } from '../index.js'
import Item from './item.vue'
import Create from './create.vue'

const props = defineProps({
  title: { type: String, default: '댓글' },
  module: String, // article
  moduleSrl: Number,
})
const error = inject('error')
const errorPath = [ 'components', 'content', 'comment', 'index.vue' ]
const state = reactive({
  loading: true,
  index: [],
})

onMounted(async () => {
  try
  {
    const res = await getData(props.module, props.moduleSrl)
    state.index = res.index
    state.total = res.total
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '댓글 데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})

function onSubmitCreate(newData)
{
  state.index.unshift(newData)
}

function onEditComment(idx, content)
{
  state.index[idx].content = content
}

function onDeleteComment(idx)
{
  state.index.splice(idx, 1)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
