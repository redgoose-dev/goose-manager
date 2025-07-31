<template>
<div class="layout">
  <header class="layout-header">
    <div class="wrap">
      <h1 class="logo">
        <router-link to="/" :title="_title">
          {{_nickname}}
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
                    tabindex="0"
                    role="button"
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
              <img
                v-if="_profile.avatar"
                :src="_profile.avatar"
                :alt="_profile.name"
                class="avatar avatar--image"/>
              <i v-else class="avatar avatar--icon"><Icon name="user"/></i>
              <em>{{_profile.name}}</em>
              <Icon name="chevron-down" class="ico-arrow"/>
            </span>
            <div>
              <ol>
                <li>
                  <router-link
                    to="/auth/account/"
                    :class="[ route.meta.active === 'account' && 'active' ]">
                    <Icon name="user" class="ico-custom"/>
                    <em>계정</em>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/preference/"
                    :class="[ route.meta.active === 'preference' && 'active' ]">
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
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '../components/icon/index.vue'

const route = useRoute()
const toast = inject('toast')
const preference = inject('preference')
const auth = inject('auth')
const current = inject('current')
const year = new Date().getFullYear()

const _mainNav = computed(() => {
  const { navigation } = preference
  return navigation
})
const _profile = computed(() => {
  const { user_avatar, user_email, user_id, user_name } = auth.provider
  return {
    id: user_id,
    name: user_name,
    avatar: user_avatar,
    email: user_email,
  }
})
const _nickname = computed(() => {
  return preference.general.nickname || 'MANAGER'
})
const _title = computed(() => {
  return preference.general.title || 'Manager title'
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
  if (!confirm('정말로 로그아웃 할까요?')) return
  try
  {
    await auth.checkout()
  }
  catch (e)
  {
    toast.add('로그아웃에 실패했습니다.', 'error')
  }
}
</script>

<style src="./default.scss" lang="scss" scoped></style>
