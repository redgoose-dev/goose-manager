<template>
<header title="" class="modal-header">
  <h1>
    <Icon v-if="props.icon" :name="props.icon"/>
    <span>{{props.title}}</span>
  </h1>
  <nav>
    <ButtonIcon
      title="닫기"
      icon-name="x"
      color="transparent"
      @click="emits('close')"/>
  </nav>
</header>
</template>

<script setup>
import { ButtonIcon } from '../button/index.js'
import Icon from '../icon/index.vue'

const props = defineProps({
  title: { type: String, required: true },
  icon: String,
})
const emits = defineEmits([ 'close' ])
</script>

<style lang="scss" scoped>
.modal-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  height: 44px;
  background: var(--color-base);
  user-select: none;
  h1 {
    margin: 0;
    padding: 0 0 0 20px;
    display: flex;
    align-items: center;
    color: var(--color-edge);
    line-height: 1.05;
    font-size: 16px;
    font-weight: 700;
    --icon-margin: 0 6px 0 0;
    --icon-size: 20px;
    --icon-color: var(--color-edge);
  }
  nav {
    padding: 0 10px 0 0;
    .button-icon {
      --button-icon-color: var(--color-edge);
    }
  }
}
</style>
