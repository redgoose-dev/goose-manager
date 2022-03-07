<template>
<article class="files">
  <header class="files-header">
    <div class="files-header__left">
      <ButtonBasic
        size="small"
        color="key"
        icon-left="upload"
        :disabled="disabledAssets">
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
import { getGlobalItems } from '../../../structure/files/manager';
import { err } from '../../../libs/error';
import ButtonBasic from '../../button/basic.vue';
import Files from '../files.vue';
import Loading from '../../etc/loading.vue';
import Empty from '../../error/empty.vue';

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

onMounted(async () => {
  try
  {
    loading.value = true;
    // TODO: 데이터 로딩
    const res = await getGlobalItems(props.path);
    // console.log(props.path)
    // loading.value = false;
  }
  catch (e)
  {
    err([ 'components', 'files-manager', 'modules', 'global.vue', 'onMounted()' ], 'error', e.message);
    throw new Error(e.message);
  }
});
</script>

<style src="./modules.scss" lang="scss" scoped></style>
