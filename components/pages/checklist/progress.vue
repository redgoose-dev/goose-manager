<template>
<div class="checklist-progress">
  <div class="checklist-progress__wrap">
    <button-icon
      type="button"
      icon-name="edit"
      :disabled="!currentDate"
      class="checklist-progress__edit"
      @click="onClickEditItem"/>
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
    srl: { type: Number },
    percent: { type: Number, default: 0 },
    currentDate: { type: Boolean, default: false },
  },
  computed: {
    computedComplete()
    {
      return this.percent === 100;
    },
  },
  methods: {
    onClickEditItem()
    {
      this.$router.push(`/checklist/${this.srl}/edit/`);
    },
  },
}
</script>

<style src="./progress.scss" lang="scss" scoped></style>
