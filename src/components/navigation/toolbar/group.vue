<template>
<div class="group">
  <slot/>
</div>
</template>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.group {
  display: flex;
  align-items: center;
  height: 34px;
  box-sizing: border-box;
  border-radius: 2px;
  gap: 1px;
}
</style>
