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
};
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
@use '../../assets/scss/variables';
.colors {
  ul {
    position: relative;
    margin: 0;
    padding: 50px 30px;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-row-gap: 40px;
    border-radius: 2px;
  }
  i {
    position: relative;
    display: block;
    width: 80px;
    height: 80px;
    margin: 0 auto;
    background-color: #eee;
    border-radius: 50%;
    box-sizing: border-box;
    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 50%;
    }
    &.color-light-bg { background-color: variables.$color-light-bg; }
    &.color-light-base { background-color: variables.$color-light-base; }
    &.color-light-invert { background-color: variables.$color-light-invert; }
    &.color-light-key { background-color: variables.$color-light-key; }
    &.color-light-sub { background-color: variables.$color-light-sub; }
    &.color-light-weak { background-color: variables.$color-light-weak; }
    &.color-light-code { background-color: variables.$color-light-code; }
    &.color-dark-bg { background-color: variables.$color-dark-bg; }
    &.color-dark-base { background-color: variables.$color-dark-base; }
    &.color-dark-invert { background-color: variables.$color-dark-invert; }
    &.color-dark-key { background-color: variables.$color-dark-key; }
    &.color-dark-sub { background-color: variables.$color-dark-sub; }
    &.color-dark-weak { background-color: variables.$color-dark-weak; }
    &.color-dark-code { background-color: variables.$color-dark-code; }
  }
  em {
    display: block;
    margin: 8px 0 0;
    font-size: 12px;
    font-style: normal;
    text-align: center;
  }
  &--light {
    ul {
      background-color: rgb(235 235 235);
    }
    em {
      color: variables.$color-light-base;
    }
    i {
      &:after {
        border: 1px solid rgb(0 0 0 / 8%);
      }
    }
  }
  &--dark {
    ul {
      background-color: rgb(40 40 40);
    }
    em {
      color: variables.$color-dark-base;
    }
    i {
      &:after {
        border: 1px solid rgb(255 255 255 / 8%);
      }
    }
  }
}
</style>
