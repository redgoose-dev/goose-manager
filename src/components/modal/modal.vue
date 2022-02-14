<template>
<transition name="modal">
  <div
    v-if="props.show"
    class="modal"
    @click="emits('close')">
    <slot/>
  </div>
</transition>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  show: Boolean,
  scroll: Boolean, // 내부에서 스크롤바 사용유무
});
const emits = defineEmits([ 'close' ]);

watch(() => props.show, value => {
  if (!props.scroll) return;
  document.querySelector('html').classList[value ? 'add' : 'remove']('mode-modal');
});
</script>

<style>

</style>
<style src="./modal.scss" lang="scss" scoped></style>
