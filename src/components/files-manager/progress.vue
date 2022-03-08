<template>
<div class="progress">
  .ready / {{props.percent}}%
</div>
</template>

<script setup>
const props = defineProps({
  percent: Number,
});
</script>

<style lang="scss" scoped>
.progress {
  //
}
</style>
