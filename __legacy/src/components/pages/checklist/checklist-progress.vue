<template>
<div class="checklist-progress">
  <div class="checklist-progress__wrap">
    <p class="checklist-progress__graph">
      <i
        :class="[complete && 'complete']"
        :style="`--percent: ${props.percent}%`"/>
    </p>
    <em class="checklist-progress__percent">{{percent}}%</em>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, required: true },
})
const complete = computed(() => (props.percent === 100))
</script>

<style src="./checklist-progress.scss" lang="scss" scoped></style>
