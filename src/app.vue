<template>
<ErrorService v-if="error" :data="error"/>
<component v-else :is="layout">
  <router-view />
</component>
</template>

<script setup>
import { computed, ref, onErrorCaptured, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import router from './router';
import { errorRecord } from './libs/error';
import ErrorService from './pages/error/500.vue';

const route = useRoute();
const error = ref(null);
const layout = computed(() => {
  const layoutName = route.meta.layout || 'default';
  return defineAsyncComponent(() => import(`./layouts/${layoutName}.vue`));
});

// children component error
onErrorCaptured((e, component, info) => {
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
