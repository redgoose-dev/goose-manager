<template>
<dl class="field-check">
  <dt class="field-check__body">
    <div>
      <label :for="props.for">{{props.label}}</label>
    </div>
    <p v-if="props.description">{{props.description}}</p>
  </dt>
  <dd class="field-check__unit">
    <slot/>
  </dd>
</dl>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  description: String,
  for: String,
});
</script>

<style lang="scss" scoped>
.field-check {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin: 0;
  padding: 16px 12px;
  &__body {
    > div {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.15;
    }
    > p {
      margin: 4px 0 0;
      line-height: 1.15;
      font-size: 11px;
      color: var(--color-weak);
    }
  }
  &__unit {
    margin: 0;
  }
}
</style>
