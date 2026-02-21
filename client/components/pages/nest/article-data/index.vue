<template>
<article class="article-data">
  <VueDraggable
    v-if="model.length > 0"
    v-model="model"
    tag="ol"
    handle=".move"
    ghost-class="ghost"
    :animation="200"
    class="index">
    <li v-for="(_,k) in model">
      <Item
        :idx="k"
        v-model="model[k]"
        class="item"
        @remove="onRemoveItem"/>
    </li>
  </VueDraggable>
  <nav class="add-item">
    <ButtonBasic
      type="button"
      title="항목 추가하기"
      size="small"
      icon-left="plus"
      color="sub"
      @click="onClickAddItem">
      항목 추가하기
    </ButtonBasic>
  </nav>
</article>
</template>

<script setup>
import { nextTick } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { pureObject } from '@/libs/object.js'
import { ButtonBasic } from '@/components/button'
import Item from './item.vue'

const model = defineModel()

async function onClickAddItem()
{
  const _items = pureObject(model.value)
  model.value = []
  await nextTick()
  model.value = [
    ..._items,
    {
      name: '',
      type: 'text',
      values: '',
      default: '',
    },
  ]
}

function onRemoveItem(key)
{
  model.value.splice(key, 1)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
