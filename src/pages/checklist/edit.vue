<template>
<article>
  <PageHeader module="checklist" title="Edit checklist"/>
  <form class="checklist-post" @submit.prevent="onSubmit">
    <header class="checklist-post__header">
      <h2>{{forms.date}}</h2>
    </header>
    <div class="checklist-post__body">
      <Textarea
        ref="$content"
        name="content"
        id="content"
        v-model="forms.content.value"
        :rows="3"
        :auto-size="true"
        @keydown.meta.enter="onSubmit"/>
    </div>
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
          Edit item
        </ButtonBasic>
      </template>
    </Controller>
  </form>
</article>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '../../store';
import { err } from '../../libs/error';
import { toast } from '../../modules/toast';
import { printf } from '../../libs/string';
import { message } from '../../message';
import { dateFormat } from '../../libs/date';
import { getData, submit } from '../../structure/checklist/edit';
import PageHeader from '../../components/page/header/index.vue';
import { Textarea } from '../../components/forms';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';

const $content = ref();
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const processing = ref(false);
const forms = reactive({
  srl: Number(route.params.srl),
  date: '',
  content: {
    value: '',
    error: null,
  },
});

async function onSubmit()
{
  try
  {
    processing.value = true;
    if (!forms.srl) throw new Error('no srl');
    if (!forms.content.value) throw new Error('no content');
    await submit(forms.srl, forms.content.value);
    await router.push(route.params.srl ? `/checklist/${forms.srl}/` : `/checklist/`);
    toast.add(printf(message.success.edit, message.word.checklist), 'success');
  }
  catch (e)
  {
    err([ 'pages', 'checklist', 'edit.vue', 'onSubmit()' ], 'error', e.message);
    processing.value = false;
    toast.add(printf(message.fail.edit, message.word.checklist), 'error');
  }
}

onMounted(async () => {
  try
  {
    const res = await getData(forms.srl.value);
    forms.srl = res.srl;
    forms.content.value = res.content;
    const regdate = res.date.split(' ')[0].split('-').map(o => Number(o));
    forms.date = dateFormat(new Date(regdate[0], regdate[1]-1, regdate[2]), store.state.preference.checklist.dateFormat);
    await nextTick();
    $content.value.changeHeight();
    loading.value = false;
  }
  catch (e)
  {
    err([ 'pages', 'checklist', 'edit.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>

<style lang="scss" scoped>
.checklist-post {
  &__header {
    background-color: rgb(var(--color-base-rgb) / 5%);
    border-radius: var(--size-radius);
    h2 {
      margin: 0;
      padding: 12px 0;
      font-size: 16px;
      line-height: 1.15;
      text-align: center;
    }
  }
  &__body {
    margin: 4px 0 0;
    .textarea {
      max-height: 480px;
    }
  }
}
</style>
