<template>
<article>
  <header class="page-header">
    <h1>Icons</h1>
    <p>`icon` 컴포넌트에 관한 내용을 다룹니다.</p>
  </header>
  <section class="page-section">
    <header>
      <h2>icons index</h2>
      <p>
        다음은 아이콘들의 목록입니다.<br/>
        아이콘의 아래의 이름은 `icon` 컴포넌트의 `name`값입니다.
      </p>
    </header>
    <ul class="icons-index">
      <li v-for="icon in _icons">
        <div>
          <Icon :name="icon" class="icon"/>
          <em>{{icon}}</em>
        </div>
      </li>
    </ul>
  </section>

  <section class="page-section">
    <header>
      <h2>color</h2>
      <p>아이콘의 컬러 예제입니다.</p>
    </header>
    <ul class="icons-index col-4">
      <li>
        <div>
          <Icon
            name="star"
            class="icon color"
            style="--icon-color:#ff235d;"/>
          <em>#ff235d</em>
        </div>
      </li>
      <li>
        <div>
          <Icon
            name="star"
            class="icon color"
            style="--icon-color: #b536ff;"/>
          <em>#b536ff</em>
        </div>
      </li>
      <li>
        <div>
          <Icon
            name="star"
            class="icon color"
            style="--icon-color: #2ab5ff;"/>
          <em>#2ab5ff</em>
        </div>
      </li>
      <li>
        <div>
          <Icon
            name="star"
            class="icon color"
            style="--icon-color: #2acd4c;"/>
          <em>#2acd4c</em>
        </div>
      </li>
    </ul>
  </section>

  <section class="page-section">
    <header>
      <h2>size</h2>
      <p>아이콘의 사이즈 예제입니다.</p>
    </header>
    <ul class="icons-index col-4">
      <li>
        <div>
          <Icon
            name="star"
            class="icon"
            style="--icon-size: 20px;"/>
          <em>20</em>
        </div>
      </li>
      <li>
        <div>
          <Icon
            name="star"
            class="icon"
            style="--icon-size: 28px;"/>
          <em>28</em>
        </div>
      </li>
      <li>
        <div>
          <Icon
            name="star"
            class="icon"
            style="--icon-size: 42px;"/>
          <em>42</em>
        </div>
      </li>
      <li>
        <div>
          <Icon
            name="star"
            class="icon"
            style="--icon-size: 64px;"/>
          <em>64</em>
        </div>
      </li>
    </ul>
  </section>

  <section class="page-section">
    <header>
      <h2>animation</h2>
      <p>아이콘 애니메이션</p>
    </header>
    <ul class="icons-index col-4">
      <li>
        <div>
          <Icon
            name="star"
            animation="spin"
            class="icon"/>
          <em>rotate</em>
        </div>
      </li>
    </ul>
  </section>
</article>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '../../components/icon/index.vue'
import iconMap from '../../components/icon/map.js'

const _icons = computed(() => {
  return Object.keys(iconMap)
})
</script>

<style src="./icon.scss" lang="scss" scoped></style>
