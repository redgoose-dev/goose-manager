<template>
<article class="files">
  <div class="files-forms">
    <input
      ref="$file"
      type="file"
      :accept="props.acceptFileType"
      :disabled="disabledAssets"
      multiple
      @change="onChangeFiles">
  </div>
  <header class="files-header">
    <div class="files-header__left">
      <ButtonBasic
        size="small"
        color="key"
        :icon-left="processing ? 'loader' : 'upload'"
        :rotate-icon="processing"
        :disabled="disabledAssets"
        @click="onClickUploadFiles">
        Upload files
      </ButtonBasic>
      <ButtonBasic
        size="small"
        icon-left="minus-square"
        :disabled="disabledAssets"
        @click="onSelectAll()">
        Select all
      </ButtonBasic>
      <ButtonBasic
        size="small"
        color="error"
        icon-left="trash-2"
        :disabled="selectedAssets"
        @click="onClickDeleteItems">
        Delete
      </ButtonBasic>
    </div>
    <p class="files-total">Count: <em>{{index.length}}</em></p>
  </header>
  <Loading v-if="loading" class="files-loading"/>
  <Attachments
    v-else
    ref="$attachments"
    :index="index"
    :processing="processing"
    @change-select="selected = $event"
    @select-context-item="onSelectContextItem"
    @upload="uploadFile($event, 0)"/>
  <footer class="files-footer">
    <nav class="files-footer__left">
      <div class="dropdown dropdown--left">
        <ButtonBasic
          icon-left="image"
          :disabled="false"
          class="dropdown__button"
          @click="onClickFunction('insert-markdown')">
          Thumbnail
        </ButtonBasic>
        <div class="dropdown__context">
          <ul>
            <li>
              <button type="button" @click="">
                Reset
              </button>
            </li>
            <li>
              <button type="button" @click="">
                Preview
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <nav class="files-footer__right">
      <div class="dropdown dropdown--right">
        <ButtonBasic
          color="key"
          icon-left="download"
          :disabled="selectedAssets"
          class="dropdown__button"
          @click="onClickFunction('insert-markdown')">
          Insert assets
        </ButtonBasic>
        <div class="dropdown__context">
          <ul>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-markdown')">
                Insert markdown
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-html')">
                Insert html
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="onClickFunction('insert-address')">
                Insert address
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </footer>
</article>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getItemsGlobal, uploadFileGlobal, removeFilesGlobal } from '../../../structure/files/manager';
import { err } from '../../../libs/error';
import { pureObject } from '../../../libs/object';
import { printf } from '../../../libs/string';
import { message } from '../../../message';
import { toast } from '../../../modules/toast';
import { createMarkdownItems, createHtmlItems, createAddressItems } from '../itemsUtil';
import ButtonBasic from '../../button/basic.vue';
import Attachments from '../attachments/index.vue';
import Loading from '../../etc/loading.vue';

const $file = ref();
const $attachments = ref();
const props = defineProps({
  module: String,
  targetSrl: Number,
  croppie: {},
  thumbnail: {},
  acceptFileType: String,
});
const emits = defineEmits([ 'close', 'custom-event' ]);
const index = ref([]);
const selected = ref([]);
const loading = ref(true);
const processing = ref(false);
const disabledAssets = computed(() => (loading.value || processing.value));
const selectedAssets = computed(() => {
  if (disabledAssets.value) return true;
  return selected.value.length <= 0;
});
const filesIdx = ref(0);

// upload files
function onClickUploadFiles()
{
  $file.value.click();
}
async function onChangeFiles(e)
{
  const { files } = e.target;
  if (processing.value || files.length <= 0) return;
  processing.value = true;
  await uploadFile(files, 0);
}
async function uploadFile(files, n)
{
  let idx;
  // TODO
}
function completeUploadFiles()
{
  $attachments.value.reset();
  $file.value.value = '';
  processing.value = false;
}
function errorUploadFiles(e)
{
  $attachments.value.reset();
  processing.value = false;
  err([ 'components', 'files-manager', 'modules', 'post.vue', 'errorUploadFiles()' ], 'error', e.message);
  toast.add('Failed upload files.', 'error');
}

async function deleteItems(paths)
{
  // TODO
}
function onDeleteItem(key)
{
  // TODO
}
function onClickDeleteItems()
{
  // TODO
}

function onSelectAll(sw)
{
  $attachments.value.selectAll(sw);
}

function onClickFunction(key)
{
  if (key === undefined) return;
  let items = selected.value.map(key => ({
    name: index.value[key].name,
    path: index.value[key].pathFull,
    type: index.value[key].type,
  }));
  switch (key)
  {
    case 'insert-markdown':
      emits('custom-event', {
        key: 'insert-text',
        value: createMarkdownItems(items),
      });
      break;
    case 'insert-html':
      emits('custom-event', {
        key: 'insert-text',
        value: createHtmlItems(items),
      });
      break;
    case 'insert-address':
      emits('custom-event', {
        key: 'insert-text',
        value: createAddressItems(items),
      });
      break;
  }
}

function onSelectContextItem(key, type)
{
  const src = index.value[key];
  if (!src) return;
  const item = {
    name: src.name,
    path: src.pathFull,
    type: src.type,
  };
  let path;
  switch (type)
  {
    case 'open-new-window':
      path = index.value[key]?.pathFull;
      if (path) window.open(path);
      break;
    case 'insert':
      emits('custom-event', {
        key: 'insert-text',
        value: createMarkdownItems([item]),
      });
      break;
    case 'insert-html':
      emits('custom-event', {
        key: 'insert-text',
        value: createHtmlItems([item]),
      });
      break;
    case 'insert-address':
      emits('custom-event', {
        key: 'insert-text',
        value: createAddressItems([item]),
      });
      break;
    case 'set-thumbnail':
      break;
    case 'delete':
      onDeleteItem(key);
      break;
  }
}

onMounted(async () => {
  try
  {
    // TODO: 포스트용 스트럭쳐를 만들어야 한다.
    // index.value = await getItemsGlobal(props.path);
    // filesIdx.value = index.value.length;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'files-manager', 'modules', 'global.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>

<style src="./modules.scss" lang="scss" scoped></style>
