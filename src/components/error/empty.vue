<template>
<article class="empty">
  <div class="empty__wrap">
    <figure class="empty__icon">
      <Icon :name="iconName"/>
    </figure>
    <h1 class="empty__title">
      {{props.title}}
    </h1>
    <p v-if="props.message" class="empty__message">
      {{props.message}}
    </p>
  </div>
</article>
</template>

<script setup>
import { iconRandomPick } from '../icons/assets';
import Icon from '../icons/index.vue';

const props = defineProps({
  title: { type: String, default: 'no item' },
  message: String,
});
const iconName = iconRandomPick();
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
  max-height: 420px;
  height: 35vw;
  &__wrap {
    text-align: center;
  }
  &__icon {
    margin: 0;
    --icon-size: 80px;
    --icon-color: var(--color-key);
    --icon-stroke-width: .5;
    svg {
      display: block;
      margin: 0 auto;
    }
  }
  &__title {
    margin: 16px 0 0;
    font-family: var(--font-eng);
    font-weight: 600;
    letter-spacing: -.75px;
    font-size: 36px;
    line-height: 1.2;
  }
  &__message {
    margin: 2px 0 0;
    font-size: 13px;
    color: var(--color-weak);
    line-height: 1.2;
  }
}
</style>
