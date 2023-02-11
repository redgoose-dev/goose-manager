<template>
<article>
  <PageHeader module="categories" prefix="[JSON]"/>
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
            { label: message.word.edit, href: `./${element.srl}/edit/` },
            { label: message.word.delete, href: `./${element.srl}/delete/` },
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
  <Empty v-else :title="message.words.noItem"/>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="code">
        JSON
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        {{printf(message.word.isCreate, message.word.category)}}
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Draggable from 'vuedraggable'
import { getDataForJson } from '../../../structure/categories'
import { err } from '../../../libs/error'
import { post, formData } from '../../../libs/api'
import { toast } from '../../../modules/toast'
import { message } from '../../../message'
import { printf } from '../../../libs/string'
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
  index: [],
})

async function onChangeIndex()
{
  try
  {
    const srls = data.index.map((o: any) => (o.srl)).join(',')
    const res = await post('/categories/sort/', formData({
      module: 'json',
      srls,
    }))
    if (!res.success) throw new Error(res.message)
    toast.add(printf(message.success.change, message.word.order), 'success').then()
  }
  catch (e: any)
  {
    err(['/pages/json/categories/index.vue', 'onChangeIndex()'], 'error', e.message)
    toast.add(printf(message.fail.change, message.word.order), 'error').then()
  }
}

onMounted(async () => {
  try
  {
    loading.value = true
    const { categories } = await getDataForJson()
    data.index = categories
    loading.value = false
  }
  catch (e: any)
  {
    err(['/pages/json/categories/index.vue', 'onMounted()'], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
