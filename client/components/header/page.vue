<template>
<header class="page-header">
  <div class="body">
    <h1>
      {{props.prefix ? `${props.prefix} ` : ''}}
      {{_message.title}}
    </h1>
    <p v-if="_message.description">
      {{_message.description}}
    </p>
  </div>
  <nav v-if="$slots.default">
    <slot/>
  </nav>
</header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  module: String,
  prefix: String,
})

const _message = computed(() => {
  switch(props.module)
  {
    case 'dashboard':
      return {
        title: props.title || 'Dashboard',
        description: props.description || '',
      }
    case 'app':
      return {
        title: props.title || 'App',
        description: props.description || '둥지를 그룹화시켜 관리하는 모듈입니다. 프로젝트 이름으로 사용하는것을 권장합니다.',
      }
    case 'article':
      return {
        title: props.title || 'Article',
        description: props.description || '포스팅된 글을 관리하는 모듈입니다.',
      }
    case 'category':
      return {
        title: props.title || 'Category',
        description: props.description || '`아티클` 분류를 관리하는 모듈입니다.',
      }
    case 'nest':
      return {
        title: props.title || 'Nest',
        description: props.description || '둥지를 관리하는 모듈입니다.',
      }
    case 'account':
      return {
        title: props.title || 'Account',
        description: props.description || '계정 정보를 관리하는 모듈입니다.',
      }
    case 'json':
      return {
        title: props.title || 'JSON',
        description: props.description || '`JSON`데이터를 관리하는 모듈입니다.',
      }
    case 'file':
      return {
        title: props.title || 'File',
        description: props.description || '첨부된 파일들을 관리하는 모듈입니다.',
      }
    case 'checklist':
      return {
        title: props.title || 'Checklist',
        description: props.description || '체크리스트를 관리하는 모듈입니다.',
      }
    case 'preference':
      return {
        title: props.title || 'Preference',
        description: props.description || '환경설정 값들을 관리합니다.',
      }
    case 'guide':
      return {
        title: props.title || 'Guide',
        description: props.description || '개발용 컴포넌트와 도구들을 모아두는 페이지입니다.',
      }
    default:
      return {
        title: props.title,
        description: props.description,
      }
  }
})
</script>

<style src="./page.scss" lang="scss" scoped></style>
