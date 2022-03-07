<template>
<form ref="$root" v-if="!loading" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="loading">
    <Field v-if="data.categories?.length > 0" label="Category" for="category">
      <FormSelect
        id="category"
        name="category"
        v-model="forms.category_srl"
        :options="data.categories"
        class="category"/>
    </Field>
    <Field label="Title" for="title">
      <FormInput
        name="title"
        id="title"
        v-model="forms.title.value"
        :maxlength="120"
        placeholder="Article title"
        :error="!!forms.title.error"
        :required="true"/>
    </Field>
    <Columns style="--columns-template: .75fr 1fr">
      <Field label="Order date" for="order">
        <FormInput
          name="order"
          id="order"
          v-model="forms.order.value"
          :maxlength="10"
          placeholder="0000-00-00"
          :error="!!forms.order.error"
          :required="true"
          style="--input-width: 140px"/>
        <Help v-if="!!forms.order.error" color="error">
          {{forms.order.error}}
        </Help>
      </Field>
      <Field label="Article type" for="type">
        <Labels class="types">
          <Label class="types__label ready">
            <FormRadio
              name="type"
              id="type"
              v-model="forms.type"
              :disabled="true"
              value="ready"/>
            <span>ready</span>
          </Label>
          <Label class="types__label public">
            <FormRadio
              name="type"
              id="type"
              v-model="forms.type"
              value="public"/>
            <span>public</span>
          </Label>
          <Label class="types__label private">
            <FormRadio
              name="type"
              id="type"
              v-model="forms.type"
              value="private"/>
            <span>private</span>
          </Label>
        </Labels>
      </Field>
    </Columns>
  </Fieldset>
  <Editor
    ref="$editor"
    name="content"
    id="content"
    v-model="forms.content.value"
    placeholder="Article content body"
    :required="true"
    :disabled="loading"
    class="editor"
    @submit="onSubmit"
    @open-file-manager="showFilesManager = true"/>
  <Controller>
    <template #left>
      <ButtonBasic icon-left="arrow-left" @click="router.back()">
        Back
      </ButtonBasic>
    </template>
    <template v-if="props.mode === 'edit'" #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        Edit article
      </ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="button"
        :icon-left="processing ? 'loader' : 'save'"
        :rotate-icon="processing"
        @click="saveDraft">
        Save draft
      </ButtonBasic>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        Publishing article
      </ButtonBasic>
    </template>
  </Controller>
  <teleport to="#modals">
    <Modal
      :show="showFilesManager"
      :scroll="true"
      @close="showFilesManager = false">
      <Body type="full">
        <FilesManager
          tab="global"
          :post="fileManagerOptions"
          acceptFileType="image/*"
          :full="true"
          @close="showFilesManager = false"/>
      </Body>
    </Modal>
  </teleport>
</form>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import getData from '../../../../structure/articles/post';
import { post, formData } from '../../../../libs/api';
import { err } from '../../../../libs/error';
import { dateFormat, checkOrderDate } from '../../../../libs/date';
import { printf, serialize } from '../../../../libs/string';
import { message } from '../../../../message';
import { toast } from '../../../../modules/toast';
import { getTypeArticle } from '../libs';
import { Fieldset, Field, Label, Labels, Controller, Help, Columns } from '../../../forms/fieldset';
import { Modal, Body } from '../../../modal';
import FormInput from '../../../forms/input.vue';
import FormSelect from '../../../forms/select.vue';
import FormRadio from '../../../forms/radio.vue';
import ButtonBasic from '../../../button/basic.vue';
import Editor from './editor.vue';
import FilesManager from '../../../files-manager/index.vue';

const router = useRouter();
const $root = ref();
const $editor = ref();
const props = defineProps({
  mode: { type: String, required: true },
  nestSrl: Number,
  articleSrl: Number,
});
const data = reactive({
  nest: null,
  categories: null,
  article: null,
});
const forms = reactive({
  app_srl: null,
  nest_srl: props.nestSrl,
  category_srl: null,
  type: 'ready',
  title: {
    value: '',
    error: null,
  },
  order: {
    value: dateFormat(new Date(), '{yyyy}-{MM}-{dd}'),
    error: null,
  },
  content: {
    value: '',
    error: null,
  },
  json: {},
});
const editor = reactive({ start: 0, end: 0 });
const loading = ref(false);
const processing = ref(false);
const showFilesManager = ref(true);
const fileManagerOptions = computed(() => {
  return {
    module: 'articles',
    targetSrl: data.article?.srl,
    croppie: {},
    thumbnail: {},
  };
});

async function save(type)
{
  let json = Object.assign({}, forms.json);

  // check error
  forms.order.error = null;

  // check order
  if (!checkOrderDate(forms.order.value))
  {
    forms.order.error = message.fail.checkOrderDate;
    throw new Error(message.fail.checkOrderDate);
  }

  // update thumbnail image
  // TODO: 썸네일 이미지 삭제하기와 업로드하기

  // save article
  let res = await post(`/articles/${data.article.srl}/edit/`, formData({
    mode: props.mode === 'create' ? 'add' : 'edit',
    app_srl: data.nest.app_srl,
    nest_srl: data.nest.srl,
    category_srl: forms.category_srl || '',
    type: type === 'publishing' ? getTypeArticle(forms.type) : 'ready',
    title: forms.title.value || '',
    content: forms.content.value || '',
    json: encodeURIComponent(JSON.stringify(json)),
    order: forms.order.value,
  }));
  if (!res.success) throw new Error(res.message);
}
async function saveDraft()
{
  if (props.mode !== 'create') return;
  if (processing.value) return;
  try
  {
    processing.value = true;
    await save('draft');
    processing.value = false;
    toast.add(message.success.draftSave, 'success');
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'post', 'index.vue', 'saveDraft()' ], 'error', e.message);
    processing.value = false;
    toast.add(message.fail.draftSave, 'error');
  }
}
async function publishing()
{
  if (processing.value) return;
  try
  {
    processing.value = true;
    if (forms.type === 'ready') forms.type = 'public';
    await save('publishing');
    processing.value = false;
    // redirection
    switch (props.mode)
    {
      case 'edit':
      case 'create':
        let queries = {};
        // TODO: category 붙이기
        // TODO: page 붙이기
        await router.push(`../${serialize(queries, true)}`)
        break;
      default:
        await router.push('/articles/');
        break;
    }
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'post', 'index.vue', 'publishing()' ], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail[props.mode], message.word.article), 'error');
  }
}
function onSubmit()
{
  publishing().then();
}

onMounted(async () => {
  try
  {
    loading.value = true;
    let { nest, categories, article } = await getData(props.nestSrl, props.articleSrl);
    data.nest = nest;
    data.categories = categories;
    data.article = article;
    forms.category_srl = article.category_srl || null;
    forms.title.value = article.title || '';
    forms.content.value = article.content || '';
    forms.order.value = article.order;
    forms.type = article.type || 'ready';
    if (article.json.thumbnail)
    {
      // TODO: 첨부파일 부분 작업하면 할 수 있다.
    }
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'post', 'index.vue', 'onMounted()' ], 'error', e.message);
    loading.value = false;
    throw new Error(e.message);
  }
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
