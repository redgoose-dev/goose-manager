<template>
<article>
  <PageHeader
    module="categories"
    :prefix="data.nest.id ? `[${data.nest.id}]` : undefined"/>
  <Loading v-if="loading"/>
  <Items v-else-if="data.index?.length > 0" theme="card" class="items">
    <Draggable
      v-model="data.index"
      item-key="srl"
      handle="button"
      tag="transition-group"
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
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import getData from '../../../structure/categories/index';
import { err } from '../../../libs/error';
import { post, formData } from '../../../libs/api';
import { toast } from '../../../modules/toast';
import { message } from '../../../message';
import { printf } from '../../../libs/string';
import { Items, Card } from '../../../components/item';
import PageHeader from '../../../components/page/header/index.vue';
import Controller from '../../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../../components/button/basic.vue';
import Loading from '../../../components/etc/loading.vue';
import Empty from '../../../components/error/empty.vue';
import Icon from '../../../components/icons/index.vue';

const route = useRoute();
const loading = ref(false);
const data = reactive({
  nest: {},
  index: [],
});

async function onChangeIndex()
{
  try
  {
    if (!route.params.nestSrl) throw new Error('no nestSrl');
    let srls = data.index.map((o, k) => (o.srl)).join(',');
    let res = await post('/categories/sort/', formData({
      nest_srl: Number(route.params.nestSrl),
      srls,
    }));
    if (!res.success) throw new Error(res.message);
    toast.add(printf(message.success.change, message.word.order), 'success');
  }
  catch (e)
  {
    err(['pages', 'nests', 'categories', 'index.vue', 'onChangeIndex()'], 'error', e.message);
    toast.add(printf(message.fail.change, message.word.order), 'error');
  }
}

onMounted(async () => {
  try
  {
    loading.value = true;
    const { nest, categories } = await getData(Number(route.params.nestSrl));
    data.index = categories;
    data.nest = nest;
    loading.value = false;
  }
  catch (e)
  {
    err(['pages', 'nests', 'categories', 'index.vue', 'onMounted()'], 'error', e.message);
    throw e.message;
  }
});
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.card {
  &:deep(.item__body) {
    padding-left: 0;
  }
}
.move {
  display: block;
  margin: 0;
  padding: 0;
  width: 72px;
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
  &:active {
    --icon-color: var(--color-key);
  }
}
.items {
  &:deep([draggable]) {
    user-select: auto;
    -webkit-user-drag: element;
  }
  &:deep(.sortable-ghost) {
    outline: 2px dashed var(--color-sub);
    outline-offset: 0;
    > * {
      opacity: .1;
    }
  }
}
</style>
