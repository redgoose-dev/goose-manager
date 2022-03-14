<template>
<article class="files">
  <div class="files-forms">
    <input
      ref="$file"
      type="file"
      :accept="localStore.state.acceptFileType"
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
    <p class="files-total">Count: <em>{{localStore.state.post.index.length}}</em></p>
  </header>
  <Loading v-if="loading" class="files-loading"/>
  <Attachments
    v-else
    ref="$attachments"
    :index="localStore.state.post.index"
    :processing="processing"
    @change-select="localStore.state.post.selected = $event"
    @select-context-item="onSelectContextItem"
    @upload="uploadFile($event, 0)"/>
  <footer class="files-footer">
    <nav class="files-footer__left">
      <div class="dropdown dropdown--left">
        <ButtonBasic
          type="label"
          icon-left="image"
          :disabled="!localStore.state.post.thumbnail.srl"
          class="dropdown__button">
          Thumbnail
        </ButtonBasic>
        <div class="dropdown__context">
          <ul>
            <li>
              <button type="button" @click="onResetThumbnail">
                Reset
              </button>
            </li>
            <li>
              <button type="button" @click="showThumbnailPreview = true">
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
  <teleport to="#modals">
    <Modal :show="showThumbnailEditor" @close="controlThumbnailEditor(false)">
      <Body type="full">
        <ThumbnailEditor
          :srl="thumbnail.srl"
          :data="thumbnail.data"
          :cropper="thumbnail.cropper"
          @close="controlThumbnailEditor(false)"
          @submit="onSubmitThumbnailEditor"/>
      </Body>
    </Modal>
    <Modal
      :show="showThumbnailPreview"
      @close="showThumbnailPreview = false">
      <Body type="full">
        <ThumbnailPreview
          :image="localStore.state.post.thumbnail.image || localStore.state.post.thumbnail.path"
          @close="showThumbnailPreview = false"/>
      </Body>
    </Modal>
  </teleport>
</article>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import localStore from '../store';
import { getItemsPost, removeFilesPost, uploadFilePost } from '../../../structure/files/manager';
import { err } from '../../../libs/error';
import { pureObject } from '../../../libs/object';
import { printf } from '../../../libs/string';
import { message } from '../../../message';
import { toast } from '../../../modules/toast';
import { createMarkdownItems, createHtmlItems, createAddressItems } from '../itemsUtil';
import { Modal, Body } from '../../modal';
import ButtonBasic from '../../button/basic.vue';
import Attachments from '../attachments/index.vue';
import Loading from '../../etc/loading.vue';
import ThumbnailEditor from '../thumbnail/editor.vue';
import ThumbnailPreview from '../thumbnail/preview.vue';

const $file = ref();
const $attachments = ref();
const emits = defineEmits([ 'close', 'custom-event' ]);
const showThumbnailEditor = ref(false);
const showThumbnailPreview = ref(false);
const thumbnail = reactive({ srl: NaN, data: {}, cropper: {} });
const loading = ref(true);
const processing = ref(false);
const disabledAssets = computed(() => (loading.value || processing.value));
const selectedAssets = computed(() => {
  if (disabledAssets.value) return true;
  return localStore.state.post.selected?.length <= 0;
});

/**
 * Upload files area
 */

/**
 * on click upload files
 * 버튼을 눌렀을때 인풋폼을 트리거하는 역할을 한다.
 */
function onClickUploadFiles()
{
  $file.value.click();
}
/**
 * on change files
 * 파일 인풋폼에서 첨부파일이 업데이트 되었을때 일어나는 이벤트
 * @param {Event} e
 * @return {Promise<void>}
 */
async function onChangeFiles(e)
{
  const { files } = e.target;
  if (processing.value || files.length <= 0) return;
  processing.value = true;
  await uploadFile(files, 0);
}
/**
 * upload file
 * 파일 하나 올리기, 목록에서 더 올라가야할 파일이 생기면 재귀함수로 실행
 * @param {FileList} files
 * @param {number} n
 * @return {Promise<void>}
 */
async function uploadFile(files, n)
{
  let idx;
  const { module, targetSrl, index } = localStore.state.post;
  try
  {
    idx = localStore.state.post.index.push({ ready: true, percent: 0 });
    idx = idx - 1;
    const res = await uploadFilePost(files[n], module, targetSrl, (e) => {
      localStore.state.post.index[idx].percent = Math.round((e.loaded / e.total) * 100);
    });
    localStore.state.post.index.splice(idx, 1, {
      ...res,
      selected: false,
      key: localStore.state.post.idx,
    });
    localStore.state.post.idx = localStore.state.post.idx + 1;
    // next queue
    n++;
    if (files.length <= n)
    {
      completeUploadFiles();
      return;
    }
    if (files.length > n) await uploadFile(files, n);
  }
  catch (e)
  {
    if (index[idx].ready) localStore.state.post.index.pop();
    errorUploadFiles(e);
  }
}
/**
 * complete upload files
 */
function completeUploadFiles()
{
  $attachments.value.reset();
  $file.value.value = '';
  processing.value = false;
}
/**
 * error upload files
 * @param {Error} e
 */
function errorUploadFiles(e)
{
  $attachments.value.reset();
  processing.value = false;
  err([ 'components', 'files-manager', 'modules', 'post.vue', 'errorUploadFiles()' ], 'error', e.message);
  toast.add('Failed upload files.', 'error');
}

/**
 * delete files area
 */

async function deleteItems(items)
{
  onSelectAll(false);
  let res = await removeFilesPost(items);
  let newIndex = pureObject(localStore.state.post.index);
  res.forEach(o => {
    switch (typeof o)
    {
      case 'number':
        newIndex[o] = false;
        break;
      case 'string':
        toast.add(o, 'error');
        break;
    }
  });
  localStore.state.post.index = newIndex.filter(Boolean);
  $attachments.value.reset();
  toast.add(printf(message.success.delete, message.word.file), 'success');
}
function onDeleteItem(key)
{
  if (key === undefined) return;
  if (!confirm(message.confirm.deleteFile)) return;
  onSelectAll(false);
  deleteItems([localStore.state.post.index[key] ? { key, srl: localStore.state.post.index[key]?.srl } : false].filter(Boolean)).then();
}
function onClickDeleteItems()
{
  if (localStore.state.post.selected.length <= 0) return;
  if (!confirm(printf(message.confirm.deleteFileItems, String(localStore.state.post.selected.length)))) return;
  let items = localStore.state.post.selected.map(key => {
    if (!localStore.state.post.index[key]) return false;
    return { key, srl: localStore.state.post.index[key]?.srl };
  }).filter(Boolean);
  deleteItems(items).then();
}

/**
 * Thumbnail area
 */

/**
 * control thumbnail editor
 * @param {boolean} sw
 * @param {number} key
 */
function controlThumbnailEditor(sw, key = undefined)
{
  if (sw)
  {
    if (key === undefined) return;
    const { post } = localStore.state;
    thumbnail.srl = post.index[key].srl;
    if (post.thumbnail?.srl && (post.thumbnail?.srl === post.index[key].srl))
    {
      thumbnail.data = {
        points: post.thumbnail.points,
        zoom: post.thumbnail.zoom,
        orientation: post.thumbnail.orientation,
      };
    }
    else
    {
      thumbnail.data = undefined;
    }
    thumbnail.cropper = {
      image: post.index[key].pathFull,
      viewport: { width: 320, height: 240, type: 'square' },
    };
  }
  else
  {
    thumbnail.srl = NaN;
    thumbnail.cropper = {};
    thumbnail.data = undefined;
  }
  showThumbnailEditor.value = sw;
}
function onSubmitThumbnailEditor(data)
{
  localStore.state.post.thumbnail = data;
  emits('custom-event', {
    key: 'update-thumbnail',
    value: data,
  });
}
function onResetThumbnail()
{
  if (!confirm('썸네일 설정을 삭제할까요?')) return;
  localStore.state.post.thumbnail = {};
  emits('custom-event', {
    key: 'update-thumbnail',
    value: null,
  });
}

/**
 * ETC area
 */

function onSelectAll(sw)
{
  $attachments.value.selectAll(sw);
}

function onClickFunction(key)
{
  if (key === undefined) return;
  let items = localStore.state.post.selected.map(key => {
    const { name, pathFull, type } = localStore.state.post.index[key];
    return {
      name,
      path: pathFull,
      type,
    };
  });
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
  const src = localStore.state.post.index[key];
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
      path = localStore.state.post.index[key]?.pathFull;
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
      controlThumbnailEditor(true, key);
      break;
    case 'delete':
      onDeleteItem(key);
      break;
  }
}

onMounted(async () => {
  try
  {
    const { module, targetSrl } = localStore.state.post;
    localStore.state.post.index = await getItemsPost(module, targetSrl);
    localStore.state.post.idx = localStore.state.post.index.length;
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'files-manager', 'modules', 'post.vue', 'onMounted()' ], 'error', e.message);
    throw e.message;
  }
});
</script>

<style src="./modules.scss" lang="scss" scoped></style>
