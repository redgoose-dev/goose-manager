<template>
<div v-if="!!auth.user" class="layout">
  <header class="layout-header">
    <div class="layout-header__wrap">
      <h1 class="layout-header__logo">
        <router-link to="/" :title="head.title">
          {{head.shortName}}
        </router-link>
      </h1>
      <nav class="layout-header__gnb">
        <ul v-if="gnb?.length > 0" class="navigation">
          <li v-for="item in gnb">
            <component
              :is="getNavigationElementName(item)"
              :to="item.link"
              :href="item.href"
              :target="item.target"
              :class="[ (route.meta.active === item.active) && 'router-link-active' ]">
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
            <div v-if="item.children && item.children.length">
              <ol>
                <li v-for="item2 in item.children">
                  <component
                    :is="getNavigationElementName(item2)"
                    :to="item2.link"
                    :href="item2.href"
                    :target="item2.target"
                    :class="[ (route.meta.active === item2.active) && 'router-link-active' ]">
                    <Icon
                      v-if="item2.icon"
                      :name="item2.icon"
                      class="ico-custom"/>
                    <em>{{item2.name}}</em>
                  </component>
                </li>
              </ol>
            </div>
          </li>
        </ul>
      </nav>
      <nav class="layout-header__side">
        <ul class="navigation">
          <li>
            <span>
              <em>{{auth.user.email}}</em>
              <Icon name="chevron-down" class="ico-arrow"/>
            </span>
            <div>
              <ol>
                <li>
                  <router-link :to="`/users/${auth.user.srl}/`">
                    <Icon name="user" class="ico-custom"/>
                    <em>{{message.word.account}}</em>
                  </router-link>
                </li>
                <li>
                  <router-link to="/preference/">
                    <Icon name="settings" class="ico-custom"/>
                    <em>{{message.word.preference}}</em>
                  </router-link>
                </li>
                <li>
                  <button type="button" @click="onClickClearTokens">
                    <Icon name="trash" class="ico-custom"/>
                    <em>{{message.word.clearTokens}}</em>
                  </button>
                </li>
                <li>
                  <button type="button" @click="onClickLogout">
                    <Icon name="log-out" class="ico-custom"/>
                    <em>{{message.word.logout}}</em>
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
    <div class="layout-footer__wrap">
      <address class="layout-footer__address">
        Copyright © 2014-{{year}} <a href="https://redgoose.me" target="_blank">redgoose.me</a>
      </address>
    </div>
  </footer>
</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { preferenceStore } from '../store/preference'
import { authStore } from '../store/auth'
import { headStore } from '../store/head'
import { post } from '../libs/api'
import { err } from '../libs/error'
import { message } from '../message'
import { toast } from '../modules/toast'
import Icon from '../components/icons/index.vue'

const route = useRoute()
const preference = preferenceStore()
const auth = authStore()
const head = headStore()
const year: number = new Date().getFullYear()
const gnb = computed<any>(() => {
  const { navigation } = preference
  return navigation.map((item: any) => {
    return {
      ...item,
      show: item.admin === undefined || item.admin,
    }
  }).filter((item) => !!item.show)
})

async function onClickClearTokens(e: any): Promise<void>
{
  if (!confirm(message.confirm.resetToken))
  {
    e.currentTarget.blur()
    return
  }
  try
  {
    e.currentTarget.blur()
    let res = await post('/token/clear/')
    if (!res.success) throw new Error(res.message)
    toast.add(message.success.resetTokens, 'success').then()
  }
  catch (e: any)
  {
    err([ '/layouts/default.vue', 'onClickClearTokens()' ], 'error', e.message)
    toast.add(message.fail.resetTokens, 'error').then()
  }
}

async function onClickLogout(): Promise<void>
{
  if (!confirm(message.confirm.logout)) return
  await auth.logout()
}

/**
 * get navigation element name
 * 메뉴 상태에 따라 링크 엘리먼트 이름 설정하기
 */
function getNavigationElementName(item: any): string
{
  if (item.link) return 'router-link'
  else if (item.href) return 'a'
  else return 'span'
}
</script>

<style src="./default.scss" lang="scss" scoped></style>
