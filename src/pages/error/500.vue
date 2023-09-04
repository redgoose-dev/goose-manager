<template>
<article class="error">
  <div class="error__wrap">
    <figure class="error__icon">
      <Icon :name="iconName"/>
    </figure>
    <h1 class="error__title">
      500: 오류가 발생했습니다.
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
import { computed } from 'vue'
import { iconRandomPick } from '../../components/icons/assets'
import { ButtonBasic } from '../../components/button'
import Icon from '../../components/icons/index.vue'

const { VITE_DEBUG } = import.meta.env
const props = defineProps({
  error: Error,
})
const iconName = iconRandomPick()
const description = computed(() => {
  return ((VITE_DEBUG === 'true') && props.error?.message) ? props.error.message : '알 수 없는 오류가 발생했습니다.'
})
</script>

<style src="./error.scss" lang="scss" scoped></style>
