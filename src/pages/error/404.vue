<template>
<article class="error">
  <div class="error__wrap">
    <figure class="error__icon">
      <Icon :name="iconName"/>
    </figure>
    <h1 class="error__title">
      404: 페이지가 없습니다.
    </h1>
    <p class="error__description">
      현재 페이지가 없거나 주소가 잘못되었습니다.
    </p>
    <nav class="error__nav">
      <div>
        <ButtonBasic color="key" @click="$router.back()">
          페이지 뒤로가기
        </ButtonBasic>
      </div>
    </nav>
  </div>
</article>
</template>

<script setup>
import { iconRandomPick } from '../../components/icons/assets';
import ButtonBasic from '../../components/button/basic.vue';
import Icon from '../../components/icons/index.vue';

const iconName = iconRandomPick();
</script>

<style src="./error.scss" lang="scss" scoped></style>
