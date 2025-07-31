<template>
<article>
  <header class="page-header">
    <h1>Colors</h1>
    <p>서비스에서 사용되는 컬러들 목록</p>
  </header>
  <section class="page-section">
    <header>
      <h1>color example</h1>
      <p>기본컬러 샘플입니다.</p>
    </header>
    <div class="colors">
      <ul>
        <li v-for="o in classNames">
          <i :class="o"/>
          <em>{{o}}</em>
        </li>
      </ul>
    </div>
  </section>
</article>
</template>

<script setup>
const classNames = [
  'color-bg',
  'color-base',
  'color-weak',
  'color-blur',
  'color-edge',
  'color-reverse',
  'color-key',
  'color-sub',
  'color-code',
  'color-success',
  'color-error',
]
</script>

<style src="./color.scss" lang="scss" scoped></style>
