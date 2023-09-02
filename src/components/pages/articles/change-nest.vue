<template>
<form v-if="!loading" @submit.prevent="onSubmit">
  <div class="information">
    <Card
      :title="data.article.title"
      :description="data.article.description"
      :image="data.article.image"
      :alt="data.article.title"
      :meta="data.article.meta"
      class="information__card"/>
  </div>
  <Fieldset :disabled="processing" class="fields">
    <Field label="둥지" for="nest">
      <FormSelect
        id="nest"
        name="nest"
        v-model="forms.nestSrl.value"
        :placeholder="null"
        :options="data.nests"
        value-type="number"/>
      <Help>같은 앱에속한 둥지를 선택해주세요.</Help>
    </Field>
    <Field v-if="data.categories?.length > 0" label="분류" for="category">
      <FormSelect
        id="category"
        name="category"
        v-model="forms.categorySrl.value"
        placeholder="분류를 선택하세요."
        :options="data.categories"/>
    </Field>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic type="button" icon-left="arrow-left" @click="router.back()">
        뒤로가기
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        둥지 변경하기
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData, requestCategories, submit } from '../../../structure/articles/change-nest'
import { err } from '../../../libs/error'
import { toast } from '../../../modules/toast'
import { Card } from '../../item'
import { FormSelect } from '../../forms'
import { Fieldset, Field, Help } from '../../forms/fieldset'
import { Controller } from '../../navigation'
import { ButtonBasic } from '../../button'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const processing = ref(false)
const data = reactive({
  article: null,
  nests: [],
  categories: [],
})
const forms = reactive({
  nestSrl: { value: null, error: null },
  categorySrl: { value: null, error: null },
})

async function onSubmit()
{
  try
  {
    processing.value = true
    await submit({
      srl: Number(route.params.articleSrl),
      nestSrl: Number(forms.nestSrl.value),
      categorySrl: String(forms.categorySrl.value),
    })
    processing.value = true
    toast.add('둥지를 변경했습니다.', 'success').then()
    let url = route.params.nestSrl ? `/nests/${forms.nestSrl.value}/articles/${route.params.articleSrl}/` : '../'
    await router.push(url)
  }
  catch (_)
  {
    processing.value = false
    toast.add('둥지를 변경하지 못했습니다.', 'error').then()
  }
}

onMounted(async () => {
  try
  {
    let res = await getData(Number(route.params.articleSrl))
    data.article = res.article
    data.nests = res.nests
    forms.nestSrl.value = res.article.nestSrl
    forms.categorySrl.value = res.article.categorySrl
    loading.value = false
  }
  catch (e)
  {
    err([ '/components/pages/articles/change-nest.vue', 'onMounted()' ], 'error', e.message)
    throw e.message
  }
})

watch(() => forms.nestSrl.value, async value => {
  processing.value = true
  forms.categorySrl.value = data.article.nestSrl === value ? data.article.categorySrl : null
  data.categories = await requestCategories(String(value))
  processing.value = false
})
</script>

<style src="./change-nest.scss" lang="scss" scoped></style>
