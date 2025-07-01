<template>
<div class="progress">
  <div class="progress__wrap">
    <p class="progress__graph">
      <i
        :class="[ _complete && 'complete' ]"
        :style="`--percent: ${props.percent}%`"/>
    </p>
    <em class="progress__percent">{{percent}}%</em>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, required: true },
})
const _complete = computed(() => (props.percent === 100))
</script>

<style src="./progress.scss" lang="scss" scoped></style>
