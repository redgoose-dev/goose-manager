<template>
<article>
  <PageHeader module="users" title="User"/>
  <Loading v-if="loading"/>
  <Fieldset v-else tag="section">
    <Field label="srl">
      {{item.srl}}
    </Field>
    <Field label="Email">
      <strong>{{item.email}}</strong>
    </Field>
    <Field label="Name">
      {{item.name}}
    </Field>
    <Field label="Register date">
      {{item.regdate}}
    </Field>
    <Field label="Admin">
      <Switch :model-value="item.admin" :readonly="true"/>
    </Field>
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
      <ButtonBasic href="./change-password/" icon-left="key">
        Change password
      </ButtonBasic>
      <ButtonBasic v-if="!self" href="./delete/" color="key" icon-left="trash">
        Delete
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import store from '../../store';
import getData from '../../structure/users/item';
import { err } from '../../libs/error';
import PageHeader from '../../components/page/header/index.vue';
import { Fieldset, Field } from '../../components/forms/fieldset';
import { Switch } from '../../components/forms';
import Controller from '../../components/forms/fieldset/controller.vue';
import ButtonBasic from '../../components/button/basic.vue';
import Loading from '../../components/etc/loading.vue';

const route = useRoute();
const loading = ref(false);
const item = ref({});
const self = computed(() => (store.state.user.srl === Number(route.params.srl)));

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('no srl');
    loading.value = true;
    item.value = await getData({ url: `/users/${route.params.srl}/` });
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'users', 'item.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>
