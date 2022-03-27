<template>
<ErrorService v-if="error" :error="error"/>
<component v-else-if="layout" :is="layout">
  <router-view/>
</component>
</template>

<script setup>
import { computed, ref, watch, onErrorCaptured, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from './store';
import { err } from './libs/error';
import ErrorService from './pages/error/500.vue';

const router = useRouter();
const route = useRoute();
const error = ref(null);
const layout = computed(() => {
  let layoutName = route.meta.layout || 'default';
  if (!route.name) return null;
  if (!store.state.user) layoutName = 'blank';
  return defineAsyncComponent(() => import(`./layouts/${layoutName}.vue`));
});

// children component error
if (!DEVELOPMENT)
{
  onErrorCaptured((e, component, info) => {

    if (typeof e === 'string')
    {
      error.value = new Error(e);
    }
    else
    {
      err([ '/app.vue', 'onErrorCaptured()' ], 'error', e.message);
      error.value = e;
    }
    return false;
  });
}

// router error
router.onError(e => {
  err([ '/app.vue', 'router.onError()' ], 'error', e.message);
  error.value = e;
});

// watch route name
watch(() => route.name, () => {
  // 오류난 화면에서 뒤로가기나 다른페이지로 이동했을때 오류값 초기화하기
  if (!!error.value) error.value = null;
});
</script>
