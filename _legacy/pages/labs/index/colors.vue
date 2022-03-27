<template>
<article>
  <header class="page-header">
    <h2>Colors</h2>
    <p>서비스에서 사용되는 컬러들 목록</p>
  </header>

  <section class="page-section">
    <header>
      <h3>light colors</h3>
      <p>라이트모드에서 사용되는 컬러들입니다.</p>
    </header>
    <div class="colors colors--light">
      <ul>
        <li v-for="o in lightClasses">
          <i :class="o"/>
          <em>{{o}}</em>
        </li>
      </ul>
    </div>
  </section>

  <section class="page-section">
    <header>
      <h3>dark colors</h3>
      <p>다크모드에서 사용되는 컬러들입니다.</p>
    </header>
    <div class="colors colors--dark">
      <ul>
        <li v-for="o in darkClasses">
          <i :class="o"/>
          <em>{{o}}</em>
        </li>
      </ul>
    </div>
  </section>
</article>
</template>

<script>
export default {
  name: 'page-colors',
  data()
  {
    return {
      lightClasses: [
        'color-bg',
        'color-base',
        'color-key',
        'color-primary',
        'color-blur',
        'color-content-bg',
        'color-content-line',
        'color-success',
        'color-error',
        'color-code',
      ],
      darkClasses: [
        'color-dark-bg',
        'color-dark-base',
        'color-dark-key',
        'color-dark-primary',
        'color-dark-blur',
        'color-dark-content-bg',
        'color-dark-content-line',
        'color-dark-code',
      ],
    };
  },
}
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>
@import "../../../assets/scss/variables";
.colors {
  ul {
    position: relative;
    margin: 0;
    padding: 50px 30px;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-row-gap: 40px;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border: 1px solid rgba(255,255,255,.05);
    }
  }
  li {}
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
    &.color-bg { background-color: $color-bg; }
    &.color-base { background-color: $color-base; }
    &.color-key { background-color: $color-key; }
    &.color-primary { background-color: $color-primary; }
    &.color-blur { background-color: $color-blur; }
    &.color-content-bg { background-color: $color-content-bg; }
    &.color-content-line { background-color: $color-content-line; }
    &.color-success { background-color: $color-success; }
    &.color-error { background-color: $color-error; }
    &.color-code { background-color: $color-code; }
    &.color-dark-bg { background-color: $color-dark-bg; }
    &.color-dark-base { background-color: $color-dark-base; }
    &.color-dark-key { background-color: $color-dark-key; }
    &.color-dark-primary { background-color: $color-dark-primary; }
    &.color-dark-blur { background-color: $color-dark-blur; }
    &.color-dark-content-bg { background-color: $color-dark-content-bg; }
    &.color-dark-content-line { background-color: $color-dark-content-line; }
    &.color-dark-code { background-color: $color-dark-code; }
  }
  em {
    display: block;
    margin: 8px 0 0;
    font-size: 12px;
    font-style: normal;
    text-align: center;
  }
  &--light {
    background-color: $color-bg;
    em {
      color: $color-base;
    }
    i {
      &:after {
        border: 1px solid rgba(0,0,0,.08);
      }
    }
  }
  &--dark {
    background-color: $color-dark-bg;
    em {
      color: $color-dark-base;
    }
    i {
      &:after {
        border: 1px solid rgba(255,255,255,.08);
      }
    }
  }
}
</style>
