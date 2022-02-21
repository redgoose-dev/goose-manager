<template>
  <article class="error">
    <div class="error__wrap">
      <figure class="error__icon">
        <Icon :name="iconName"/>
      </figure>
      <h1 class="error__title">
        500: 오류가 발생헀습니다.
      </h1>
      <p class="error__description">{{description}}</p>
      <nav class="error__nav">
        <div>
          <ButtonBasic href="/" color="key">
            첫화면으로 이동하기
          </ButtonBasic>
        </div>
      </nav>
    </div>
  </article>
</template>

<script setup>
import { iconRandomPick } from '../../components/icons/assets';
import { message } from '../../message';
import ButtonBasic from '../../components/button/basic.vue';
import Icon from '../../components/icons/index.vue';

const props = defineProps({
  error: Error,
});
const iconName = iconRandomPick();
const description = (window.DEBUG && props.error?.message) ? props.error.message : message.words.unknownError;
</script>

<style src="./error.scss" lang="scss" scoped></style>
