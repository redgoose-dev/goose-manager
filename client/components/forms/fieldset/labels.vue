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
  gap: var(--labels-gap, (24px 16px));
}
</style>
