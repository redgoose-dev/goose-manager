<template>
<label class="label">
  <slot/>
</label>
</template>

<style lang="scss" scoped>
.label {
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: var(--label-gap, 8px);
  justify-content: flex-start;
  padding: 4px 0;
  box-sizing: border-box;
}
</style>
