<template>
<form ref="$root" v-if="!loading" @submit.prevent="onSubmit">
  <Fieldset class="fields" :disabled="processing">
    <Field v-if="data.categories?.length > 0" label="Category" for="category">
      <Select
        id="category"
        name="category"
        v-model="forms.category_srl"
        :options="data.categories"
        class="category"/>
    </Field>
    <Field label="Title" for="title">
      <Input
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
        <Input
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
            <Radio
              name="type"
              id="type"
              v-model="forms.type"
              :disabled="true"
              value="ready"/>
            <span>ready</span>
          </Label>
          <Label class="types__label public">
            <Radio
              name="type"
              v-model="forms.type"
              value="public"/>
            <span>public</span>
          </Label>
          <Label class="types__label private">
            <Radio
              name="type"
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
      v-if="!loading"
      :show="showFilesManager"
      :scroll="true"
      @close="showFilesManager = false">
      <Body type="full">
        <FilesManager
          tab="post"
          :global="{ path: 'articles' }"
          :post="fileManagerOptions"
          :accept-file-type="store.state.preference.files.acceptFileType"
          :full-size="true"
          :use-thumbnail="true"
          @custom-event="onFilesManagerEvent"
          @close="showFilesManager = false"/>
      </Body>
    </Modal>
  </teleport>
</form>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../../../../store';
import { getData, deleteThumbnail, uploadThumbnail } from '../../../../structure/articles/post';
import { post, formData } from '../../../../libs/api';
import { err } from '../../../../libs/error';
import { dateFormat, checkOrderDate } from '../../../../libs/date';
import { printf } from '../../../../libs/string';
import { getTypeArticle, createQueries } from '../libs';
import { message } from '../../../../message';
import { toast } from '../../../../modules/toast';
import { Input, Select, Radio } from '../../../forms';
import { Fieldset, Field, Label, Labels, Help, Columns } from '../../../forms/fieldset';
import { Controller } from '../../../navigation';
import { Modal, Body } from '../../../modal';
import ButtonBasic from '../../../button/basic.vue';
import Editor from './editor.vue';
import FilesManager from '../../../files-manager/index.vue';

const route = useRoute();
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
  category_srl: (!route.query.category || route.query.category === 'null') ? null : route.query.category,
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
  json: {
    thumbnail: {},
  },
});
const loading = ref(true);
const processing = ref(false);
const showFilesManager = ref(false);
const fileManagerOptions = computed(() => {
  const { thumbnail, files } = data.nest.json;
  return {
    module: 'articles',
    targetSrl: data.article?.srl,
    limitCount: files.count,
    limitSize: files.sizeSingle,
    cropper: {
      viewport: {
        width: thumbnail?.width || 320,
        height: thumbnail?.height || 240,
        type: 'square',
      },
    },
    thumbnail: forms.json.thumbnail || undefined,
    thumbnailType: thumbnail.type || 'crop',
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
  if (forms.json.thumbnail?.image)
  {
    // delete current image
    if (forms.json.thumbnail?.path)
    {
      await deleteThumbnail(forms.json.thumbnail.path);
    }
    // upload new image
    forms.json.thumbnail.path = await uploadThumbnail(forms.json.thumbnail.image);
    delete forms.json.thumbnail.image;
  }
  else if (forms.json.thumbnail?.path)
  {
    forms.json.thumbnail = {};
  }

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
    toast.add(message.fail.draftSave, 'error');
    processing.value = false;
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
        await router.push(`../${createQueries(['category','page'], route.query)}`)
        break;
      default:
        await router.push(`/articles/${createQueries(['category','page'], route.query)}`);
        break;
    }
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'post', 'index.vue', 'publishing()' ], 'error', e.message);
    toast.add(printf(message.fail[props.mode], message.word.article), 'error');
    processing.value = false;
  }
}
function onSubmit()
{
  publishing().then();
}

/**
 * on FilesManager event
 * custom event
 * @param {string} key
 * @param {any} value
 */
function onFilesManagerEvent({ key, value })
{
  switch (key)
  {
    case 'insert-text':
      insertTextToEditor(value);
      showFilesManager.value = false;
      break;
    case 'update-thumbnail':
      forms.json.thumbnail = value ? {
        srl: value.srl,
        image: value.image,
        points: value.points,
        zoom: value.zoom,
        orientation: value.orientation,
      } : undefined;
      break;
  }
}

/**
 * insert text to editor
 * 에디터 입력창에 문자를 넣는다.
 * @param {string} keyword
 * @param {number} position
 */
function insertTextToEditor(keyword, position = 0)
{
  if (!keyword) return;
  let content = forms.content.value + '';
  let start = $editor.value.position.start;
  if (start === 0) keyword = keyword.replace(/^\n/g, '');
  forms.content.value = content.substr(0, start) + keyword + content.substr(start);
  // change cursor
  let endPosition = start + (position ? position : keyword.length);
  $editor.value.changeCursor(endPosition, endPosition);
}

onMounted(async () => {
  try
  {
    loading.value = true;
    let { nest, categories, article } = await getData(props.nestSrl, props.articleSrl);
    data.nest = nest;
    data.categories = categories;
    data.article = article;
    if (article.category_srl)
    {
      forms.category_srl = article.category_srl === 'null' ? null : article.category_srl;
    }
    forms.title.value = article.title || '';
    forms.content.value = article.content || '';
    forms.order.value = article.order;
    forms.type = article.type || 'ready';
    forms.json = article.json || { thumbnail: {} };
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'articles', 'post', 'index.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>

<style src="./index.scss" lang="scss" scoped></style>
