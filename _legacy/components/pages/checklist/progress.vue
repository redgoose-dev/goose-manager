<template>
<div class="checklist-progress">
  <div class="checklist-progress__wrap">
    <div class="checklist-progress__graph">
      <i
        :class="[ computedComplete && 'complete' ]"
        :style="`--percent: ${percent}%`"/>
    </div>
    <em class="checklist-progress__percent">{{percent}}%</em>
  </div>
</div>
</template>

<script>
export default {
  name: 'checklist-progress',
  components: {
    'icon': () => import('~/components/icon'),
    'button-icon': () => import('~/components/button/icon'),
  },
  props: {
    percent: { type: Number, default: 0 },
  },
  computed: {
    computedComplete()
    {
      return this.percent === 100;
    },
  },
}
</script>

<style src="./progress.scss" lang="scss" scoped></style>
