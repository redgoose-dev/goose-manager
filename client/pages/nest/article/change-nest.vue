<template>
<article>
  <PageHeader module="article" title="Article / Change nest"/>
  <Loading v-if="state.loading"/>
  <form v-else-if="data.article && data.nest?.length > 0" @submit.prevent="onSubmit">
    <section class="article-info">
      <h1>아티클 정보</h1>
      <Card
        :title="data.article.title"
        :description="data.article.description"
        :use-thumbnail="true"
        :image="data.article.image"
        :meta="data.article.meta"
        :private="data.article.private"/>
    </section>
    <Fieldset legend="변경할 둥지 선택하기" class="change-nest">
      <Field label="둥지">
        <FormSelect
          v-model="forms.nestSrl"
          :options="data.nest"
          placeholder="둥지를 선택해주세요."
          @update:modelValue="onChangeNest"/>
      </Field>
      <Field v-if="data.category?.length > 0" label="분류">
        <FormSelect
          v-model="forms.categorySrl"
          :options="data.category"
          placeholder="분류를 선택해주세요."/>
      </Field>
    </Fieldset>
    <Controller>
      <template #left>
        <ButtonBasic
          type="button"
          icon-left="arrow-left"
          @click="router.back()">
          뒤로가기
        </ButtonBasic>
      </template>
      <template #right>
        <ButtonBasic
          type="submit"
          color="key"
          :icon-left="state.processing ? 'loader' : 'check'"
          :disabled="state.processing"
          :rotate-icon="state.processing">
          {{state.processing ? '처리중..' : '둥지 변경하기'}}
        </ButtonBasic>
      </template>
    </Controller>
  </form>
  <Empty v-else title="no data"/>
</article>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData, changeNest, submit } from '../../../structure/article/change-nest.js'
import PageHeader from '../../../components/header/page.vue'
import { Loading, Empty } from '../../../components/content/index.js'
import Card from '../../../components/item/card.vue'
import { FormSelect } from '../../../components/forms/index.js'
import { Fieldset, Field } from '../../../components/forms/fieldset/index.js'
import { Controller } from '../../../components/navigation/index.js'
import { ButtonBasic } from '../../../components/button/index.js'

const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const error = inject('error')
const errorPath = [ 'pages', 'nest', 'article', 'change-nest.vue' ]
const state = reactive({
  loading: true,
  processing: false,
})
const data = reactive({
  article: null,
  nest: [],
  category: [],
})
const forms = reactive({
  nestSrl: null,
  categorySrl: '',
})

onMounted(async () => {
  try
  {
    const res = await getData(Number(route.params.article))
    data.article = res.article
    data.nest = res.nest || []
    data.category = res.category || []
    forms.nestSrl = data.article.nestSrl
    forms.categorySrl = data.article.categorySrl || ''
    console.log(forms.categorySrl)
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '데이터를 가져오지 못했습니다.',
      error: e,
      useToast: false,
    })
  }
  finally
  {
    state.loading = false
  }
})

async function onChangeNest()
{
  if (!forms.nestSrl) return
  try
  {
    state.processing = true
    const res = await changeNest(forms.nestSrl)
    data.category = res.category || []
    forms.categorySrl = ''
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onMounted' ],
      message: '분류 데이터를 가져오지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}

async function onSubmit()
{
  try
  {
    if (!forms.nestSrl)
    {
      toast.add('둥지를 선택해주세요.', 'error').then()
      return
    }
    if (data.article.nestSrl === forms.nestSrl)
    {
      toast.add('둥지를 변경해주세요.', 'error').then()
      return
    }
    state.processing = true
    await submit(Number(route.params.article), forms.nestSrl, forms.categorySrl)
    toast.add('둥지를 변경했습니다.', 'success').then()
    router.push('../').then()
  }
  catch (e)
  {
    error.catch({
      path: [ ...errorPath, 'onSubmit()' ],
      message: '둥지를 변경하지 못했습니다.',
      error: e,
    })
  }
  finally
  {
    state.processing = false
  }
}
</script>

<style src="./change-nest.scss" lang="scss" scoped></style>
