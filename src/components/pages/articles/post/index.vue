<template>
<form ref="$root" @submit.prevent="onSubmit">
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
        :required="true"
        @submit="saveDraft"/>
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
          style="--input-width: 140px"
          @submit="saveDraft"/>
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
      @close="showFilesManager = false">
      <Body type="full">
        <div>smdgiosdg</div>
        <button type="button" @click="showFilesManager = false">close</button>
      </Body>
    </Modal>
  </teleport>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import getData from '../../../../structure/articles/post';
import { get, post, formData, checkForms } from '../../../../libs/api';
import { err } from '../../../../libs/error';
import { dateFormat } from '../../../../libs/date';
import { message } from '../../../../message';
import { toast } from '../../../../modules/toast';
import { Fieldset, Field, Label, Labels, Controller, Help, Columns } from '../../../forms/fieldset';
import { Modal, Body } from '../../../modal';
import FormInput from '../../../forms/input.vue';
import FormSelect from '../../../forms/select.vue';
import FormRadio from '../../../forms/radio.vue';
import ButtonBasic from '../../../button/basic.vue';
import Editor from './editor.vue';

const router = useRouter();
const $root = ref();
const $editor = ref();
const props = defineProps({
  mode: { type: String, required: true },
  nestSrl: { type: Number, required: true },
  articleSrl: Number,
});
const data = reactive({
  nest: null,
  categories: null,
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
const showFilesManager = ref(false);

async function save(type)
{
  let json = Object.assign({}, forms.json);

  // check order

  // update thumbnail image

  // save article
}
async function saveDraft()
{
  //
}
async function publishing()
{
  //
}
async function onSubmit()
{
  console.log('onSubmit()');
  await publishing();
}

onMounted(async () => {
  try
  {
    loading.value = true;
    let { nest, categories, article } = await getData(props.nestSrl, props.articleSrl);
    data.nest = nest;
    data.categories = categories;
    // TODO: 수정모드를 위하여 article 값 업데이트하기
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

<style lang="scss" scoped>
.category {
  display: inline-block;
  --select-width: auto;
}
.types {
  --column-gap: 16px;
  &__label {
    &.ready {
      cursor: not-allowed;
      > span {
        opacity: .5;
      }
    }
  }
}
.editor {
  margin: 0;
}
</style>
