<template>
<Loading v-if="state.loading"/>
<template v-else-if="state.index.length > 0">
  <p v-if="props.module === 'nest'" class="nest-info">
    둥지: <strong>{{state.nest?.name}} <em>{{state.nest?.code}}</em></strong>
  </p>
  <div class="body">
    <VueDraggable
      v-model="state.index"
      handle=".move"
      ghost-class="ghost"
      :animation="200"
      class="items theme--card"
      @end="onChangeOrder">
      <Card
        v-for="o in state.index"
        :title="o.title"
        :meta="o.meta"
        :nav="[
          { label: '수정', href: `./${o.srl}/edit/` },
          { label: '삭제', href: `./${o.srl}/delete/` },
        ]"
        :status="o.status"
        class="card">
        <template #before>
          <button type="button" title="순서변경" class="move">
            <Icon name="move"/>
          </button>
        </template>
      </Card>
    </VueDraggable>
  </div>
</template>
<Empty v-else title="No data"/>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { getData, changeOrder } from '../../../structure/category/index.js'
import { Loading, Empty } from '../../content/index.js'
import { Card } from '../../item/index.js'
import Icon from '../../icon/index.vue'

const $index = ref()
const toast = inject('toast')
const error = inject('error')
const props = defineProps({
  module: { type: String, required: true },
  moduleSrl: Number,
})
const state = reactive({
  loading: true,
  nest: null,
  index: [],
})
const errorPath = [ 'components', 'pages', 'category', 'index.vue' ]

const _head = computed(() => {
  switch (props.module)
  {
    case 'nest':
      return `둥지이름: ${state.nest?.name || '알 수 없음'}`
    default:
      return null
  }
})

onMounted(async () => {
  try
  {
    const { nest, category } = await getData(props.module, props.moduleSrl)
    state.nest = nest
    state.index = category
  }
  catch (_e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '분류 데이터를 가져오지 못했습니다.',
      error: _e,
    })
  }
  finally
  {
    state.loading = false
  }
})

async function onChangeOrder(e)
{
  if (e.newIndex === e.oldIndex) return
  const srls = state.index.map(o => o.srl).join(',')
  await changeOrder(props.module, props.moduleSrl, srls)
  toast.add('순서를 변경했습니다.', 'success').then()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
