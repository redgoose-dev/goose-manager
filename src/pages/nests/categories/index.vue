<template>
<article>
  <PageHeader module="categories"/>
  <Loading v-if="loading"/>
  <Items v-else-if="index?.length > 0" theme="card">
    <Draggable
      v-model="index"
      item-key="srl"
      handle="button"
      tag="transition-group"
      @start="onStartIndex"
      @end="onEndIndex"
      @change="onChangeIndex">
      <template #item="{element, key}">
        <Card
          :title="element.title"
          :meta="element.meta"
          :nav="[
            { label: 'Edit', href: `./${element.srl}/edit/` },
            { label: 'Delete', href: `./${element.srl}/delete/` },
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
  <Empty v-else/>
  <Controller>
    <template #left>
      <ButtonBasic href="../../" icon-left="cloud">
        Nests
      </ButtonBasic>
      <ButtonBasic href="../articles/" icon-left="droplet">
        Articles
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./create/" color="key" icon-left="plus">
        Create category
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import getData from '../../../structure/nests/categories';
import { err } from '../../../libs/error';
import { Items, Card } from '../../../components/item';
import PageHeader from '../../../components/page/header/index.vue';
import Controller from '../../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../../components/button/basic.vue';
import Loading from '../../../components/etc/loading.vue';
import Empty from '../../../components/error/empty.vue';
import Icon from '../../../components/icons/index.vue';

const route = useRoute();
const loading = ref(false);
const index = ref(null);

function onStartIndex()
{
  console.log('call onStartIndex()');
}

function onEndIndex()
{
  console.log('call onEndIndex()');
}

function onChangeIndex()
{
  //
}

onMounted(async () => {
  try
  {
    loading.value = true;
    index.value = await getData(Number(route.params.srl));
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'nests', 'categories', 'index.vue', 'onMounted()'], 'error', e.message);
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.card {
  &:deep(.item__body) {
    padding-left: 8px;
  }
}
.move {
  display: block;
  margin: 0;
  padding: 0;
  width: 64px;
  background: none;
  border: none;
  @include mixins.button-touch-options(false);
  --icon-size: 16px;
  --icon-stroke-width: 1.5;
  --icon-color: var(--color-weak);
  svg {
    display: block;
    margin: 0 auto;
  }
}
</style>
