<template>
<ul class="status">
  <li v-for="o in props.items">
    <strong>{{o.label}}</strong>
    <span>{{o.value}}</span>
  </li>
</ul>
</template>

<script setup>
const props = defineProps({
  items: Array,
})
</script>

<style lang="scss" scoped>
@use '../../../scss/mixins';
.status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0 20px;
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
  user-select: none;
}
li {
  text-align: center;
}
strong {
  display: block;
  margin: 0 auto;
  max-width: 100px;
  font-size: 10px;
  line-height: 1.05;
  font-weight: 400;
  color: var(--color-weak);
  box-sizing: border-box;
  @include mixins.single-line-text();
}
span {
  display: block;
  margin: 4px auto 0;
  font-family: var(--font-eng);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.05;
  box-sizing: border-box;
}
</style>
