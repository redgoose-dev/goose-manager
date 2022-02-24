<template>
<div class="columns">
  <slot/>
</div>
</template>

<style lang="scss" scoped>
.columns {
  display: grid;
  grid-template-columns: var(--columns-template, 1fr 1fr);
  gap: 30px;
}
</style>
