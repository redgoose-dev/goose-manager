<template>
<div class="labels">
  <slot/>
</div>
</template>

<style lang="scss" scoped>
.labels {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: var(--column-gap, 24px);
  row-gap: var(--row-gap, 4px);
}
</style>
