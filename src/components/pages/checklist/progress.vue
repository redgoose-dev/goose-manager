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
import { computed } from 'vue';

const props = defineProps({
  percent: { type: Number, default: 0 },
});
const complete = computed(() => (props.percent === 100));
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.checklist-progress {
  position: sticky;
  bottom: 60px;
  margin: 60px auto 40px;
  width: 680px;
  height: var(--progress-height, 48px);
  padding: 0 24px;
  border-radius: calc(var(--progress-height, 48px) / 2);
  background-color: var(--color-bg);
  user-select: none;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px rgb(var(--color-base-rgb) / 5%), 0 -1px 12px 0 rgba(0,0,0,.15);
  &__wrap {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    height: 100%;
    box-sizing: border-box;
  }
  &__graph {
    margin: 0;
    height: var(--progress--graph-height, 10px);
    box-sizing: border-box;
    border-radius: calc(var(--progress--graph-height, 10px) * .5);
    background-color: #e2e2e2;
    overflow: hidden;
    i {
      display: block;
      height: 100%;
      width: var(--percent, 0%);
      background-color: var(--color-key);
      transition: width 200ms ease-out, background-color 300ms ease-out;
      &.complete {
        background-color: var(--color-success);
      }
    }
  }
  &__percent {
    display: block;
    font-style: normal;
    margin-left: 20px;
    font-weight: 500;
    font-size: 13px;
  }
  @include mixins.dark-mode() {
    // TODO
  }
}
</style>
