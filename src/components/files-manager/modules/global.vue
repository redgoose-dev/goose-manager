<template>
<article class="files">
  <div class="files-forms">
    <input
      ref="$file"
      type="file"
      :multiple="true"
      :accept="props.acceptFileType"
      :disabled="disabledAssets"
      @change="onChangeFiles">
  </div>
  <header class="files-header">
    <div class="files-header__left">
      <ButtonBasic
        size="small"
        color="key"
        icon-left="upload"
        :disabled="disabledAssets"
        @click="onClickUploadFiles">
        Upload files
      </ButtonBasic>
      <ButtonBasic
        size="small"
        icon-left="minus-square"
        :disabled="disabledAssets">
        Select all
      </ButtonBasic>
      <ButtonBasic
        size="small"
        color="error"
        icon-left="trash-2"
        :disabled="disabledAssets">
        Delete
      </ButtonBasic>
    </div>
    <p class="files-total">Count: <em>{{index.length}}</em></p>
  </header>
  <div class="files__body">
    <Loading v-if="loading" class="files-loading"/>
    <Files v-else-if="index.length > 0"/>
    <Empty v-else class="files-empty"/>
    <pre style="font-size: 13px;line-height: 1.4">{{index}}</pre>
  </div>
  <footer class="files-footer">
    <nav class="files-footer__left"></nav>
    <nav class="files-footer__right">
      <div class="dropdown dropdown--right">
        <ButtonBasic
          color="key"
          icon-left="download"
          :disabled="disabledAssets"
          @click="">
          Insert image
        </ButtonBasic>
        <div class="dropdown__context">
          <ul>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="">
                Insert address
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="">
                Insert html
              </button>
            </li>
            <li>
              <button
                type="button"
                :disabled="disabledAssets"
                @click="">
                Insert text
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
import { ref, reactive, onMounted, computed } from 'vue';
import store from '../../../store';
import { getGlobalItems, uploadFileGlobal } from '../../../structure/files/manager';
import { err } from '../../../libs/error';
import { toast } from '../../../modules/toast';
import ButtonBasic from '../../button/basic.vue';
import Files from '../files.vue';
import Loading from '../../etc/loading.vue';
import Empty from '../../error/empty.vue';

const $file = ref();
const props = defineProps({
  acceptFileType: String,
  path: String,
});
const emits = defineEmits([ 'close' ]);
const index = ref([]);
const loading = ref(false);
const processing = ref(false);
const dragEvent = ref(false);
const disabledAssets = computed(() => {
  return loading.value || processing.value;
});
const filesIdx = ref(0);

function onClickUploadFiles()
{
  $file.value.click();
}
async function onChangeFiles(e)
{
  const { files } = e.target;
  const { preference } = store.state;
  if (processing.value || files.length <= 0) return;
  processing.value = true;
  await uploadFile(files, 0);
}
async function uploadFile(files, n)
{
  let idx;
  try
  {
    idx = index.value.push({ ready: true, percent: 0 });
    idx = idx - 1;
    if (idx === 1) throw new Error('==>')
    const res = await uploadFileGlobal(files[idx], props.path, (e) => {
      console.log('progress', Math.round((e.loaded / e.total) * 100) + '%');
      index.value[idx].percent = Math.round((e.loaded / e.total) * 100);
    });
    index.value[idx] = {
      ready: false,
      key: filesIdx.value,
      name: '',
      path: '',
      pathFull: '',
      size: '',
      type: '',
      badge: [],
    };
    filesIdx.value = filesIdx.value + 1;
    if (files.length <= n + 1)
    {
      completeUploadFiles();
      return;
    }
    await uploadFile(files, n + 1);
  }
  catch (e)
  {
    if (index.value[idx].ready) index.value.pop();
    errorUploadFiles(e);
  }
}
function completeUploadFiles()
{
  processing.value = false;
  console.log(processing.value)
  console.log('completeUploadFiles()');
}
function errorUploadFiles(e)
{
  processing.value = false;
  console.error(e);
  toast.add('Failed upload files.', 'error');
}

onMounted(async () => {
  try
  {
    loading.value = true;
    const res = await getGlobalItems(props.path);
    loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'files-manager', 'modules', 'global.vue', 'onMounted()' ], 'error', e.message);
    throw new Error(e.message);
  }
});
</script>

<style src="./modules.scss" lang="scss" scoped></style>
