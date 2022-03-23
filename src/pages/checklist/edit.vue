<template>
<article>
  <PageHeader module="checklist" title="Edit checklist"/>
  <form class="checklist-post" @submit.prevent="onSubmit">
    <header class="checklist-post__header">
      <h2>{{forms.date}}</h2>
    </header>
    <PostToolbar
      class="checklist-post__toolbar"
      @select-item="onSelectToolbarItem"/>
    <div class="checklist-post__body">
      <Textarea
        ref="$content"
        name="content"
        id="content"
        v-model="forms.content.value"
        :rows="8"
        :auto-size="true"
        @position="onUpdatePosition"
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
  <teleport to="#modals">
    <Preview
      :show="showPreview"
      :content="preview"
      @close="controlPreview(false)"/>
    <Modal
      v-if="!loading"
      :show="showFilesManager"
      :scroll="true"
      @close="showFilesManager = false">
      <Body type="full">
        <FilesManager
          tab="global"
          :global="{ path: store.state.preference.files.globalPath }"
          :post="fileManagerOptions"
          :accept-file-type="store.state.preference.files.acceptFileType"
          :full-size="true"
          :use-thumbnail="false"
          @custom-event="onFilesManagerEvent"
          @close="showFilesManager = false"/>
      </Body>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { marked } from 'marked';
import store from '../../store';
import { err } from '../../libs/error';
import { toast } from '../../modules/toast';
import { printf } from '../../libs/string';
import { message } from '../../message';
import { dateFormat } from '../../libs/date';
import { getData, submit } from '../../structure/checklist/edit';
import PageHeader from '../../components/page/header/index.vue';
import { Modal, Body } from '../../components/modal';
import { Textarea } from '../../components/forms';
import { Controller } from '../../components/navigation';
import ButtonBasic from '../../components/button/basic.vue';
import PostToolbar from '../../components/navigation/post-toolbar.vue';
import Preview from '../../components/content/preview.vue';
import FilesManager from '../../components/files-manager/index.vue';

const $content = ref();
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const processing = ref(false);
const forms = reactive({
  srl: Number(route.params.srl),
  date: '',
  content: { value: '', error: null },
});
const position = ref({ start: 0, end: 0 });
const showPreview = ref(false);
const preview = ref('');
const showFilesManager = ref(false);
const fileManagerOptions = computed(() => {
  return {
    module: 'checklist',
    targetSrl: NaN,
    limitCount: NaN,
    limitSize: NaN,
  };
});

/**
 * insert text
 * @param {string} text
 * @param {number} cursor
 * @return {Promise<void>}
 */
async function insertText(text, cursor)
{
  if (!text) return;
  let content = forms.content.value + '';
  const { start } = position.value;
  if (start === 0) text = text.replace(/^\n/g, '');
  content = content.substr(0, start) + text + content.substr(start);
  forms.content.value = content;
  let last = start + (cursor || text.length);
  position.value.start = last;
  position.value.end = last;
  await nextTick();
  $content.value.changeHeight();
  $content.value.changeCursor(position.value.start, position.value.end);
  $content.value.focus();
}

/**
 * on select toolbar item
 * @param {string} code
 */
function onSelectToolbarItem(code)
{
  switch (code)
  {
    case 'insert-space':
      insertText(`<p><br/></p>\n`, undefined);
      break;
    case 'insert-iframe':
      insertText(`<div class="iframe"></div>\n`, 20);
      break;
    case 'insert-grid-group':
      insertText(`<div class="grid-group">\n\n</div>\n`, 25);
      break;
    case 'insert-grid-item':
      insertText(`<figure class="grid-item" data-mobile="3" data-tablet="" data-desktop="" data-desktop-large="">\n\n</figure>\n`, 96);
      break;
    case 'insert-picture':
      insertText(`<picture>\n  <source srcset="" media="(prefers-color-scheme: dark)"/>\n  <source srcset="" media="(prefers-color-scheme: light)"/>\n  <img src="" alt=""/>\n</picture>\n`, undefined);
      break;
    case 'open-file-manager':
      showFilesManager.value = true;
      break;
    case 'preview':
      controlPreview(true);
      break;
  }
}

/**
 * on update position
 * @param {{start, end}} o
 */
function onUpdatePosition(o)
{
  position.value.start = o.start;
  position.value.end = o.end;
}

/**
 * control preview
 * @param {boolean} sw
 */
function controlPreview(sw)
{
  if (sw && !forms.content.value)
  {
    toast.add(printf(message.error.emptyContent, message.word.content), 'error');
    return;
  }
  if (sw)
  {
    preview.value = marked(forms.content.value);
  }
  else
  {
    preview.value = '';
  }
  showPreview.value = sw;
}

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

/**
 * FilesManager event
 * @param {string} key
 * @param {any} value
 */
function onFilesManagerEvent({ key, value })
{
  switch (key)
  {
    case 'insert-text':
      insertText(value, undefined);
      showFilesManager.value = false;
      break;
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
  &__toolbar {
    margin: 16px 0 0;
  }
  &__body {
    margin: 8px 0 0;
    .textarea {
      max-height: 480px;
    }
  }
}
</style>
