<template>
<form ref="root" @submit.prevent="onSubmit">
  <Fieldset :disabled="loading">
    <Field label="Name" for="name">
      <FormInput
        v-model="forms.name.value"
        name="name"
        id="name"
        :maxlength="40"
        placeholder="Please type name"
        :error="!!forms.name.error"
        :required="true"
        class="input-name"/>
    </Field>
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
        {{isEdit ? 'Edit category' : 'Create category'}}
      </ButtonBasic>
    </template>
  </Controller>
</form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { get, post, formData, checkForms } from '../../../libs/api';
import { err } from '../../../libs/error';
import { printf } from '../../../libs/string';
import { message } from '../../../message';
import { toast } from '../../../modules/toast';
import { Fieldset, Field, Controller } from '../../forms/fieldset';
import FormInput from '../../forms/input.vue';
import ButtonBasic from '../../button/basic.vue';

const root = ref();
const router = useRouter();
const props = defineProps({
  mode: { type: String, required: true },
  nestSrl: Number,
  srl: Number,
});
const forms = reactive({
  name: { value: '', error: null },
});
const loading = ref(false);
const processing = ref(false);
const isEdit = computed(() => (props.mode === 'edit'));

async function onSubmit()
{
  try
  {
    // TODO: 데이터 처리 부분을 스트럭쳐 영역으로 분리해야겠다.
    processing.value = true;
    checkForms(forms);
    await post(isEdit.value ? `/categories/${props.srl}/edit/` : '/categories/', formData({
      nest_srl: props.nestSrl,
      name: forms.name.value,
    }));
    processing.value = false;
    await router.push(isEdit.value ? `../../` : '../');
    toast.add(printf(message.success[props.mode], 'category'), 'success');
  }
  catch (e)
  {
    err([ 'components', 'pages', 'categories', 'post.vue', 'onSubmit()' ], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail[props.mode], 'categories'), 'error');
  }
}

onMounted(async () => {
  if ( props.mode !== 'edit' ) return;
  try
  {
    // TODO: 데이터 가져오는 부분을 스트럭쳐 영역으로 분리해야겠다.
    loading.value = true;
    const res = await get(`/categories/${props.srl}/`);
    forms.name.value = res.data.name;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'pages', 'categories', 'post.vue', 'onMounted()' ], 'error', e.message);
    loading.value = false;
    throw new Error(e.message);
  }
});
</script>

<style lang="scss" scoped>
.input-name {
  --input-width: 320px;
}
</style>
