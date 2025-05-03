<template>
<div class="layout">
  <header class="layout-header">
    <div class="wrap">
      <h1 class="logo">
        <router-link to="/" :title="VITE_APP_NAME">
          {{VITE_APP_NICKNAME}}
        </router-link>
      </h1>
      <nav class="main-nav">
        <ul v-if="_mainNav?.length > 0" class="navigation">
          <li v-for="item in _mainNav">
            <component
              :is="getNavigationElementName(item)"
              :to="item.link"
              :href="item.link"
              :target="item.target"
              :class="[
                route.meta.active === item.active && 'active',
              ]">
              <Icon
                v-if="item.icon"
                :name="item.icon"
                class="ico-custom"/>
              <em>{{item.name}}</em>
              <Icon
                v-if="item.children && item.children.length"
                name="chevron-down"
                class="ico-arrow"/>
            </component>
            <div v-if="item.children?.length > 0">
              <ol>
                <li v-for="item2 in item.children">
                  <component
                    :is="getNavigationElementName(item2)"
                    :to="item2.link"
                    :href="item2.href"
                    :target="item2.target"
                    :class="[
                      route.meta.active === item2.active && 'active',
                    ]">
                    <Icon v-if="item2.icon" :name="item2.icon" class="ico-custom"/>
                    <em>{{item2.name}}</em>
                  </component>
                </li>
              </ol>
            </div>
          </li>
        </ul>
      </nav>
      <nav class="side-nav">
        <ul class="navigation right">
          <li>
            <span>
              <em>username</em>
              <Icon name="chevron-down" class="ico-arrow"/>
            </span>
            <div>
              <ol>
                <li>
                  <router-link :to="`/user/`">
                     <Icon name="user" class="ico-custom"/>
                    <em>계정</em>
                  </router-link>
                </li>
                <li>
                  <router-link to="/preference/">
                     <Icon name="settings" class="ico-custom"/>
                    <em>환경설정</em>
                  </router-link>
                </li>
                <li>
                  <button type="button" @click="onClickCheckout">
                     <Icon name="log-out" class="ico-custom"/>
                    <em>로그아웃</em>
                  </button>
                </li>
              </ol>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <div class="container">
    <div class="container__wrap">
      <slot/>
    </div>
  </div>
  <footer class="layout-footer">
    <div class="wrap">
      <address>
        <span>Copyright © 2014-{{year}}</span>
        <a href="https://redgoose.me" target="_blank">redgoose.me</a>
      </address>
    </div>
  </footer>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { preferenceStore, currentStore } from '../store/app.js'
import { authStore } from '../store/auth.js'
import Icon from '../components/icon/index.vue'

const { VITE_APP_NAME, VITE_APP_NICKNAME } = import.meta.env

const route = useRoute()
const preference = preferenceStore()
const auth = authStore()
const current = currentStore()
const year = new Date().getFullYear()

const _mainNav = computed(() => {
  const { navigation } = preference
  return navigation
})

/**
 * get navigation element name
 * 메뉴 상태에 따라 링크 엘리먼트 이름 설정하기
 */
function getNavigationElementName(item)
{
  if (item.link) return 'router-link'
  else if (item.href) return 'a'
  else return 'span'
}

async function onClickCheckout()
{
  //
}
</script>

<style src="./default.scss" lang="scss" scoped></style>
