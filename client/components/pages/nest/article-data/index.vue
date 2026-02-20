<template>
<article class="article-data">
  <ol v-if="model.length > 0" class="index">
    <li v-for="(_,k) in model">
      <Item
        :idx="k"
        v-model="model[k]"
        class="item"
        @remove="onRemoveItem"/>
    </li>
  </ol>
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
import { ButtonBasic } from '@/components/button'
import Item from './item.vue'

const model = defineModel()

function onClickAddItem()
{
  model.value.push({
    name: '',
    type: 'text',
    values: '',
    default: '',
  })
}

function onRemoveItem(key)
{
  model.value.splice(key, 1)
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
