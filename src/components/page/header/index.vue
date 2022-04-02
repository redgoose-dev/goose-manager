<template>
<header class="page-header">
  <div>
    <h1 class="page-header__title">
      {{props.prefix ? `${props.prefix} ` : ''}}
      {{messages.title}}
    </h1>
    <p v-if="messages.description" class="page-header__description">
      {{messages.description}}
    </p>
  </div>
  <nav v-if="$slots.default" class="page-header__nav">
    <slot/>
  </nav>
</header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  description: String,
  module: String,
  prefix: String,
});
const messages = computed(() => {
  switch(props.module)
  {
    case 'dashboard':
      return {
        title: props.title || 'Dashboard',
        description: props.description || '',
      };
    case 'apps':
      return {
        title: props.title || 'Apps',
        description: props.description || '둥지를 그룹화시켜 관리하는 모듈입니다. 프로젝트 이름으로 사용하는것을 권장합니다.',
      };
    case 'articles':
      return {
        title: props.title || 'Articles',
        description: props.description || '글 목록을 관리하는 모듈입니다.',
      };
    case 'categories':
      return {
        title: props.title || 'Categories',
        description: props.description || '`Articles`의 분류를 관리하는 모듈입니다.',
      };
    case 'nests':
      return {
        title: props.title || 'Nests',
        description: props.description || '둥지를 관리하는 모듈입니다. 둥지는 `Article`모듈의 그룹입니다.',
      };
    case 'users':
      return {
        title: props.title || 'Users',
        description: props.description || '사용자 목록을 관리하는 모듈입니다.',
      };
    case 'json':
      return {
        title: props.title || 'JSON',
        description: props.description || '`JSON`데이터를 관리하는 모듈입니다.',
      };
    case 'files':
      return {
        title: props.title || 'Files',
        description: props.description || '첨부된 파일들을 관리하는 모듈입니다.',
      };
    case 'checklist':
      return {
        title: props.title || 'Checklist',
        description: props.description || '체크리스트를 관리하는 모듈입니다.',
      };
    case 'preference':
      return {
        title: props.title || 'Preference',
        description: props.description || '환경설정 값들을 관리합니다.',
      };
    case 'guide':
      return {
        title: props.title || 'Guide',
        description: props.description || '개발용 컴포넌트와 도구들을 모아두는 페이지',
      };
    default:
      return {
        title: props.title,
        description: props.description,
      };
  }
});
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/mixins';
.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin: 0 0 30px;
  user-select: none;
  &__title {
    margin: 0;
    font-size: 32px;
    line-height: 1.25;
    letter-spacing: -1px;
    font-weight: 600;
    font-family: var(--font-eng);
    color: rgb(0 0 0);
  }
  &__description {
    margin: -2px 0 0;
    font-size: 11px;
    letter-spacing: -.25px;
    color: var(--color-weak);
  }
  &__nav {
    display: flex;
    align-items: center;
  }
  @include mixins.dark-mode() {
    &__title {
      color: rgb(255 255 255);
    }
  }
}
</style>
