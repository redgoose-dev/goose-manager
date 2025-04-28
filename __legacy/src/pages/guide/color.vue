<template>
<article>
  <header class="page-header">
    <h1>Colors</h1>
    <p>서비스에서 사용되는 컬러들 목록</p>
  </header>

  <section class="page-section">
    <header>
      <h2>light colors</h2>
      <p>라이트모드에서 사용되는 컬러들입니다.</p>
    </header>
    <div class="colors colors--light">
      <ul>
        <li v-for="o in classes.light">
          <i :class="o"/>
          <em>{{o}}</em>
        </li>
      </ul>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h2>dark colors</h2>
      <p>다크모드에서 사용되는 컬러들입니다.</p>
    </header>
    <div class="colors colors--dark">
      <ul>
        <li v-for="o in classes.dark">
          <i :class="o"/>
          <em>{{o}}</em>
        </li>
      </ul>
    </div>
  </section>
</article>
</template>

<script setup>
const classes = {
  light: [
    'color-light-bg',
    'color-light-base',
    'color-light-invert',
    'color-light-key',
    'color-light-sub',
    'color-light-weak',
    'color-light-code',
  ],
  dark: [
    'color-dark-bg',
    'color-dark-base',
    'color-dark-invert',
    'color-dark-key',
    'color-dark-sub',
    'color-dark-weak',
    'color-dark-code',
  ],
}
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style src="./color.scss" lang="scss" scoped></style>
