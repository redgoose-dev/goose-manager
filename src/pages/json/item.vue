<template>
<article>
  <PageHeader module="json" :title="`JSON / ${item.name}`"/>
  <Loading v-if="loading"/>
  <Fieldset v-else tag="section">
    <Field label="srl">
      {{item.srl}}
    </Field>
    <Field label="Name">
      <strong>{{item.name}}</strong>
    </Field>
    <Field label="Description">
      {{item.description}}
    </Field>
    <pre class="json-code"><code>{{item.json}}</code></pre>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="list">
        Index
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./edit/" icon-left="edit">
        Edit
      </ButtonBasic>
      <ButtonBasic href="./delete/" color="key" icon-left="trash">
        Delete
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { err } from '../../libs/error';
import getData from '../../structure/json/item';
import PageHeader from '../../components/page/header/index.vue';
import { Fieldset, Field } from '../../components/forms/fieldset';
import Controller from '../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';

const route = useRoute();
const loading = ref(false);
const item = ref({});

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('no srl');
    loading.value = true;
    item.value = await getData({ url: `/json/${route.params.srl}/` });
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'json', 'item.vue', 'onMounted()' ], 'error', e.message);
    loading.value = false;
    throw new Error(e.message);
  }
});
</script>

<style lang="scss" scoped>
.json-code {
  display: block;
  margin: 0;
  padding: 16px;
  box-sizing: border-box;
  background-color: rgb(var(--color-base-rgb) / 5%);
  border-radius: 2px;
  line-height: 1.42;
  font-size: 15px;
  font-family: var(--font-console);
}
</style>
