<template>
<article>
  <PageHeader
    module="categories"
    :prefix="data.nest.id ? `[${data.nest.id}]` : ''"/>
  <Loading v-if="loading"/>
  <Items v-else-if="data.index?.length > 0" theme="card" class="items">
    <Draggable
      v-model="data.index"
      item-key="srl"
      handle="button"
      tag="ul"
      @change="onChangeIndex">
      <template #item="{element, key}">
        <Card
          :title="element.title"
          :meta="element.meta"
          :nav="[
            { label: '수정', href: `./${element.srl}/edit/` },
            { label: '삭제', href: `./${element.srl}/delete/` },
          ]"
          class="card">
          <template #before>
            <button type="button" title="move item" class="move">
              <Icon name="move"/>
            </button>
          </template>
        </Card>
      </template>
    </Draggable>
  </Items>
  <Empty v-else title="no item"/>
  <Controller>
    <template #left>
      <ButtonBasic href="../../" icon-left="cloud">
        둥지
      </ButtonBasic>
      <ButtonBasic href="../articles/" icon-left="droplet">
        아티클
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        분류 만들기
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Draggable from 'vuedraggable'
import { getDataForArticles } from '../../../structure/categories'
import { err } from '../../../libs/error'
import { post, formData } from '../../../libs/api'
import { toast } from '../../../modules/toast'
import { Items, Card } from '../../../components/item'
import PageHeader from '../../../components/page/header/index.vue'
import { Controller } from '../../../components/navigation'
import { ButtonBasic } from '../../../components/button'
import Loading from '../../../components/etc/loading.vue'
import Empty from '../../../components/error/empty.vue'
import Icon from '../../../components/icons/index.vue'

const route = useRoute()
const loading = ref<boolean>(false)
const data = reactive<any>({
  nest: {},
  index: [],
})

async function onChangeIndex()
{
  try
  {
    if (!route.params.nestSrl) throw new Error('no nestSrl')
    const srls = data.index.map((o: any) => (o.srl)).join(',')
    const res = await post('/categories/sort/', formData({
      module: 'article',
      target_srl: Number(route.params.nestSrl),
      srls,
    }))
    if (!res.success) throw new Error(res.message)
    toast.add('순서를 변경했습니다.', 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/nests/categories/index.vue', 'onChangeIndex()'], 'error', e.message)
    toast.add('순서를 변경하지 못했습니다.', 'error').then()
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const { nest, categories } = await getDataForArticles(Number(route.params.nestSrl))
    data.nest = nest
    data.index = categories
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/nests/categories/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
