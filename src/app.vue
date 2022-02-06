<template>
<ErrorService v-if="error" :data="error"/>
<component v-else-if="layout" :is="layout">
  <router-view/>
</component>
</template>

<script setup>
import { computed, ref, onErrorCaptured, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import router from './router';
import store from './store';
import { errorRecord } from './libs/error';
import ErrorService from './pages/error/500.vue';

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
  console.error(e, component, info);
  error.value = e;
  errorRecord(e);
  return false;
});
// router error
router.onError(e => {
  error.value = e;
  errorRecord(e);
});
</script>
