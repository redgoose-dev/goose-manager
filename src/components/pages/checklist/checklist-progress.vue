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

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  percent: number
}>()
const complete = computed<boolean>(() => (props.percent === 100));
</script>

<style src="./checklist-progress.scss" lang="scss" scoped></style>
