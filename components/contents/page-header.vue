<template>
<header :class="['page-header', eng && 'page-header--eng']">
  <div class="page-header__body">
    <small v-if="!!prefix" class="page-header__prefix">{{prefix}}</small>
    <h2 class="page-header__title">{{title || messages.title}}</h2>
    <p class="page-header__description">{{messages.description}}</p>
  </div>
  <nav v-if="!!$slots.default" class="page-header__nav">
    <slot/>
  </nav>
</header>
</template>

<script>
export default {
  props: {
    module: { type: String, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    prefix: { type: String, default: null },
    eng: { type: Boolean, default: true },
  },
  computed: {
    messages()
    {
      switch(this.module)
      {
        case 'apps':
          return {
            title: this.title || 'Apps',
            description: this.description || '둥지를 그룹화시켜 관리하는 모듈입니다. 프로젝트 이름으로 사용하는것을 권장합니다.',
          };
        case 'articles':
          return {
            title: this.title || 'Articles',
            description: this.description || '글 목록을 관리하는 모듈입니다.',
          };
        case 'categories':
          return {
            title: this.title || 'Categories',
            description: this.description || '`Articles`의 분류를 관리하는 모듈입니다.',
          };
        case 'nests':
          return {
            title: this.title || 'Nests',
            description: this.description || '둥지를 관리하는 모듈입니다. 둥지는 `Article`모듈의 그룹입니다.',
          };
        case 'users':
          return {
            title: this.title || 'Users',
            description: this.description || '사용자 목록을 관리하는 모듈입니다.',
          };
        case 'json':
          return {
            title: this.title || 'JSON',
            description: this.description || '`JSON`데이터를 관리하는 모듈입니다.',
          };
        case 'files':
          return {
            title: this.title || 'Files',
            description: this.description || '첨부된 파일들을 관리하는 모듈입니다.',
          };
        case 'checklist':
          return {
            title: this.title || 'Checklist',
            description: this.description || '체크리스트를 관리하는 모듈입니다.',
          };
        default:
          return {
            title: this.title,
            description: this.description,
          };
      }
    },
  },
}
</script>

<style src="./page-header.scss" lang="scss" scoped/>
