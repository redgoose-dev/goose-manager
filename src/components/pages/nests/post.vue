<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset legend="Basic fields" class="basic" :disabled="loading">
    <Field label="Apps" for="apps">
      <FormSelect
        id="apps"
        name="apps"
        v-model="forms.app_srl.value"
        :options="apps"
        placeholder="Select app_srl"
        style="--select-width: 240px"/>
    </Field>
    <Field label="ID" for="id">
      <FormInput
        type="text"
        name="id"
        id="id"
        v-model="forms.id.value"
        placeholder="Nest ID"
        :maxlength="24"
        :error="!!forms.id.error"
        :required="true"
        style="--input-width: 200px"/>
      <Help v-if="!!forms.id.error" color="error">{{forms.id.error}}</Help>
      <Help>영문과 숫자 `-`, `_`만 입력 가능합니다.</Help>
    </Field>
    <Field label="Name" for="name">
      <FormInput
        type="text"
        name="name"
        id="name"
        v-model="forms.name.value"
        placeholder="Nest name"
        :maxlength="40"
        :required="true"
        style="--input-width: 320px"/>
      <Help>이 "Nest"에 대한 설명을 입력합니다.</Help>
    </Field>
    <Field label="Description" for="description">
      <FormInput
        type="text"
        name="description"
        id="description"
        v-model="forms.description.value"
        placeholder="Description text"
        :maxlength="200"/>
    </Field>
  </Fieldset>
  <Fieldset legend="Extra fields" class="extra" :disabled="loading">
    <Field label="Using category" for="useCategory">
      <FormSwitch v-model="forms.json.useCategory" :values="[ '0', '1' ]"/>
    </Field>
    <Field label="Using comment" for="useComment">
      <FormSwitch v-model="forms.json.useComment" :values="[ '0', '1' ]"/>
    </Field>
    <Field label="Thumbnail size" for="thumbnailWidth">
      <Labels>
        <Label>
          <span>Width:</span>
          <FormInput
            type="number"
            name="thumbnailWidth"
            id="thumbnailWidth"
            v-model="forms.json.thumbnail.width"
            placeholder="640"
            :min="100"
            :max="9999"
            size="small"
            class="input-thumbnail-size"/>
          <span>px</span>
        </Label>
        <Label>
          <span>Height:</span>
          <FormInput
            type="number"
            name="thumbnailHeight"
            id="thumbnailHeight"
            v-model="forms.json.thumbnail.height"
            placeholder="480"
            :min="100"
            :max="9999"
            size="small"
            class="input-thumbnail-size"/>
          <span>px</span>
        </Label>
      </Labels>
    </Field>
    <Field label="Thumbnail size type" for="thumbnailType">
      <Labels>
        <Label>
          <FormRadio
            name="thumbnailType"
            id="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="crop"/>
          <span>crop</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resize"/>
          <span>resize</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resizeWidth"/>
          <span>resize(width)</span>
        </Label>
        <Label>
          <FormRadio
            name="thumbnailType"
            v-model="forms.json.thumbnail.type"
            value="resizeHeight"/>
          <span>resize(height)</span>
        </Label>
      </Labels>
    </Field>
    <Field label="Thumbnail size tool" for="thumbnailSizeTool">
      <FormSwitch v-model="forms.json.useThumbnailSizeTool" :values="[ '0', '1' ]"/>
    </Field>
    <Field label="Files count" for="filesCount">
      <FormInput
        type="number"
        name="filesCount"
        id="filesCount"
        v-model="forms.json.files.count"
        placeholder="5"
        :min="1"
        :max="99"
        size="small"
        style="--input-width: 70px"/>
      <Help>업로드 할 수 있는 파일의 갯수를 설정합니다.</Help>
    </Field>
    <Columns>
      <Field label="Upload size(single)" for="filesSizeSingle">
        <Label>
          <FormInput
            type="number"
            name="filesSizeSingle"
            id="filesSizeSingle"
            v-model="forms.json.files.sizeSingle"
            placeholder="5242880"
            :min="100"
            :max="99999999"
            size="small"
            class="input-file-size"/>
          <small>({{printBytes.singleFile}})</small>
        </Label>
      </Field>
      <Field label="Upload size(total)" for="filesSizeTotal">
        <Label>
          <FormInput
            type="number"
            name="filesSizeTotal"
            id="filesSizeTotal"
            v-model="forms.json.files.sizeTotal"
            placeholder="20971520"
            :min="100"
            :max="99999999"
            size="small"
            class="input-file-size"/>
          <small>({{printBytes.totalFiles}})</small>
        </Label>
      </Field>
    </Columns>
  </Fieldset>
  <Controller>
    <template #left>
      <ButtonBasic icon-left="arrow-left" @click="router.back()">Back</ButtonBasic>
    </template>
    <template #right>
      <ButtonBasic
        type="submit"
        color="key"
        :icon-left="processing ? 'loader' : 'check'"
        :rotate-icon="processing">
        {{isEdit ? 'Edit nest' : 'Create nest'}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { post, formData, checkForms } from '../../../libs/api';
import { err } from '../../../libs/error';
import { printf, validateId, getByte } from '../../../libs/string';
import { message } from '../../../message';
import { toast } from '../../../modules/toast';
import getData, { defaultJson } from '../../../structure/nests/post';
import { Fieldset, Field, Controller, Help, Columns, Labels, Label } from '../../forms/fieldset';
import FormInput from '../../forms/input.vue';
import FormSelect from '../../forms/select.vue';
import FormRadio from '../../forms/radio.vue';
import FormSwitch from '../../forms/switch.vue';
import ButtonBasic from '../../button/basic.vue';

const root = ref();
const router = useRouter();
const props = defineProps({
  mode: { type: String, required: true },
  srl: Number,
});
const forms = reactive({
  app_srl: { value: '', error: null },
  id: { value: '', error: null },
  name: { value: '', error: null },
  description: { value: '', error: null },
  json: defaultJson,
});
const apps = ref();
const loading = ref(true);
const processing = ref(false);
const isEdit = computed(() => (props.mode === 'edit'));
const printBytes = reactive({
  singleFile: computed(() => getByte(forms.json.files?.sizeSingle || 0)),
  totalFiles: computed(() => getByte(forms.json.files?.sizeTotal || 0)),
});

async function onSubmit()
{
  forms.id.error = null;
  if (!validateId(forms.id.value))
  {
    forms.id.error = printf(message.words.pleaseCheck, 'ID');
    root.value.id.focus();
  }
  try
  {
    processing.value = true;
    checkForms(forms);
    const data = formData({
      app_srl: forms.app_srl.value,
      id: forms.id.value,
      name: forms.name.value,
      description: forms.description.value,
      json: encodeURIComponent(JSON.stringify(forms.json)),
    });
    await post((props.mode === 'edit') ? `/nests/${props.srl}/edit/` : '/nests/', data);
    processing.value = false;
    await router.push('/nests/');
    toast.add(printf(message.success[props.mode], message.word.nest), 'success');
  }
  catch (e)
  {
    err([ 'components', 'pages', 'nests', 'post.vue', 'onSubmit()' ], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail[props.mode], message.word.nest), 'error');
  }
}

onMounted(async () => {
  try
  {
    const res = await getData(props.mode, props.srl);
    if (props.mode === 'edit')
    {
      forms.app_srl.value = res.nest.app_srl;
      forms.id.value = res.nest.id;
      forms.name.value = res.nest.name;
      forms.description.value = res.nest.description;
    }
    apps.value = res.apps;
    forms.json = res.nest.json;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'nests', 'post.vue', 'onMounted()' ], 'error', e.message);
    loading.value = false;
    throw new Error(e.message);
  }
});
</script>

<style lang="scss" scoped>
.extra {
  margin-top: 50px;
}
.input-thumbnail-size {
  --input-width: 80px;
}
.input-file-size {
  --input-width: 110px;
}
</style>
