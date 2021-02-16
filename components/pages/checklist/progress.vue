<template>
<div class="checklist-progress">
  <p>.progress</p>
  <em>{{percent}}</em>
</div>
</template>

<script>
export default {
  name: 'checklist-progress',
  props: {
    percent: { type: Number, default: 0 },
  },
}
</script>

<style src="./progress.scss" lang="scss" scoped></style>
