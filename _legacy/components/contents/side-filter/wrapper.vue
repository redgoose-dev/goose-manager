<template>
<div class="side-filter">
  <div v-if="!!$slots.side" class="side-filter__side">
    <aside>
      <slot name="side"/>
    </aside>
  </div>
  <div class="side-filter__body">
    <slot name="body"/>
  </div>
</div>
</template>

<script>
export default {
  name: 'side-filter-wrapper',
}
</script>

<style src="./wrapper.scss" lang="scss" scoped></style>
