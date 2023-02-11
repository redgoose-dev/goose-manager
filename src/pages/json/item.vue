<template>
<article>
  <PageHeader module="json" :title="`JSON / ${item.name}`"/>
  <Loading v-if="loading"/>
  <Fieldset v-else tag="section">
    <Field :label="message.word.srl">
      {{item.srl}}
    </Field>
    <Field :label="message.word.name">
      <strong>{{item.name}}</strong>
    </Field>
    <Field :label="message.word.description">
      {{item.description}}
    </Field>
    <Field v-if="item.categoryName" :label="message.word.categoryName">
      {{item.categoryName}}
    </Field>
    <pre class="json-code"><code>{{json}}</code></pre>
    <Field v-if="!!item.path" :label="message.word.path" class="path">
      <a v-if="isPathLink" :href="item.path" target="_blank">{{item.path}}</a>
      <template v-else>{{item.path}}</template>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic href="../" icon-left="list">
        {{message.word.list}}
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic href="./edit/" icon-left="edit">
        {{message.word.edit}}
      </ButtonBasic>
      <ButtonBasic href="./delete/" color="key" icon-left="trash">
        {{message.word.delete}}
      </ButtonBasic>
    </template>
  </Controller>
</article>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { err } from '../../libs/error'
import { message } from '../../message'
import getData from '../../structure/json/item'
import PageHeader from '../../components/page/header/index.vue'
import { Fieldset, Field } from '../../components/forms/fieldset'
import { Controller } from '../../components/navigation'
import { ButtonBasic } from '../../components/button'
import Loading from '../../components/etc/loading.vue'

const route = useRoute()
const loading = ref<boolean>(false)
const item = ref<any>({})
const json = computed<string>(() => {
  return JSON.stringify(item.value.json, null, 2)
})
const isPathLink = computed<boolean>(() => {
  if (!item.value.path) return false
  return /^http/.test(item.value.path)
})

onMounted(async () => {
  try
  {
    if (!route.params.srl) throw new Error('no srl')
    loading.value = true
    item.value = await getData()
    loading.value = false
  }
  catch (e: any)
  {
    err([ '/pages/json/item.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})
</script>

<style src="./item.scss" lang="scss" scoped></style>
