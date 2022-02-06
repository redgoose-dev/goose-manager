<template>
<article>
  <header class="page-header">
    <h2>Icons</h2>
    <p>`icon` 컴포넌트에 관한 내용을 다룹니다.</p>
  </header>

  <section class="page-section">
    <header>
      <h3>icons index</h3>
      <p>
        다음은 아이콘들의 목록입니다. 아이콘의 아래의 이름은 `icon` 컴포넌트의 `name`값입니다.
      </p>
    </header>
    <ul class="icons-index">
      <li v-for="icon in icons" class="icons-index__item">
        <div>
          <Icon :name="icon" class="icon"/>
          <em>{{icon}}</em>
        </div>
      </li>
    </ul>
  </section>

  <section class="page-section">
    <header>
      <h3>color</h3>
      <p>아이콘의 컬러 예제입니다.</p>
    </header>
    <ul class="icons-index icons-index--col-4">
      <li class="icons-index__item">
        <div>
          <Icon name="target" color="#ff235d" class="icon color"/>
          <em>#ff235d</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="twitter" color="#b536ff" class="icon color"/>
          <em>#b536ff</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="cloud-snow" color="#2ab5ff" class="icon color"/>
          <em>#2ab5ff</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="radio" color="#2acd4c" class="icon color"/>
          <em>#2acd4c</em>
        </div>
      </li>
    </ul>
  </section>

  <section class="page-section">
    <header>
      <h3>size</h3>
      <p>아이콘의 사이즈 예제입니다.</p>
    </header>
    <ul class="icons-index icons-index--col-4">
      <li class="icons-index__item">
        <div>
          <Icon name="target" :size="24" class="icon"/>
          <em>12</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="twitter" :size="36" class="icon"/>
          <em>24</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="cloud-snow" :size="48" class="icon"/>
          <em>36</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="radio" :size="60" class="icon"/>
          <em>48</em>
        </div>
      </li>
    </ul>
  </section>

  <section class="page-section">
    <header>
      <h3>stroke-width</h3>
      <p>아이콘의 선 두께 예제입니다.</p>
    </header>
    <ul class="icons-index icons-index--col-4">
      <li class="icons-index__item">
        <div>
          <Icon name="target" :size="36" :stroke-width=".5" class="icon"/>
          <em>.5</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="twitter" :size="36" :stroke-width="1" class="icon"/>
          <em>1</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="cloud-snow" :size="36" :stroke-width="2" class="icon"/>
          <em>2</em>
        </div>
      </li>
      <li class="icons-index__item">
        <div>
          <Icon name="radio" :size="36" :stroke-width="2.5" class="icon"/>
          <em>2.5</em>
        </div>
      </li>
    </ul>
  </section>
</article>
</template>

<script setup>
import icons from '../../components/icons/svg-index';
import Icon from '../../components/icons/index.vue';
</script>

<style src="./common.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
@use '../../assets/scss/mixins';
.icons-index {
  --column: 8;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(var(--column), 1fr);
  gap: 4px;
  &__item {
    position: relative;
    padding-top: 100%;
    div {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f4f4f4;
      flex-direction: column;
      svg:not(.color) {
        color: var(--color-base);
      }
    }
    em {
      display: block;
      margin: 6px 0 0;
      font-family: var(--font-eng);
      font-style: normal;
      font-size: 11px;
      line-height: 1.15;
      color: var(--color-weak);
    }
  }
  &--col-4 {
    --column: 4;
  }
  //@include mixins.dark-mode() {
  //  &__item {
  //    div {
  //      background-color: #333;
  //    }
  //  }
  //}
}
</style>
