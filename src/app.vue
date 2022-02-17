<template>
<ErrorService v-if="error" :data="error"/>
<component v-else-if="layout" :is="layout">
  <router-view/>
</component>
</template>

<script setup>
import { computed, ref, onErrorCaptured, defineAsyncComponent } from 'vue';
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
onErrorCaptured((e, component, info) => {
  err([ 'app.vue', 'onErrorCaptured()' ], 'error', e.message);
  error.value = e;
  return false;
});

// router error
router.onError(e => {
  err([ 'app.vue', 'router.onError()' ], 'error', e.message);
  error.value = e;
});
</script>
