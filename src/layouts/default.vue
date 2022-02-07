<template>
<div v-if="!!store.state.user" class="layout">
  <header class="layout-header">
    <div class="layout-header__wrap">
      <h1 class="layout-header__logo">
        <router-link to="/" :title="store.state.header.title">
          {{store.state.header.shortName}}
        </router-link>
      </h1>
      <nav class="layout-header__gnb">
        <ul v-if="gnb?.length > 0" class="navigation">
          <li v-for="item in gnb">
            <component
              :is="getNavigationElementName(item)"
              :to="item.link"
              :href="item.href"
              :target="item.target">
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
                    :target="item2.target">
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
              <em>{{store.state.user.email}}</em>
              <Icon name="chevron-down" class="ico-arrow"/>
            </span>
            <div>
              <ol>
                <li>
                  <ButtonBasic
                    type="router"
                    icon-left="user"
                    :href="`/users/${store.state.user.srl}/`">
                    Account
                  </ButtonBasic>
                </li>
                <li>
                  <ButtonBasic type="button" icon-left="trash" @click.prevent="onClickClearTokens">
                    Clear tokens
                  </ButtonBasic>
                </li>
                <li>
                  <ButtonBasic type="button" icon-left="log-out" @click="onClickLogout">
                    Logout
                  </ButtonBasic>
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

<script setup>
import { computed } from 'vue';
import axios from 'axios';
import store from '../store';
import { logout } from '../libs/auth';
// import {} from '../libs/util';
import Icon from '../components/icons/index.vue';
import ButtonBasic from '../components/button/basic.vue';

const year = new Date().getFullYear();
const gnb = computed(() => {
  const { navigation } = store.state.preference;
  return navigation.map(item => {
    return {
      ...item,
      show: item.admin === undefined || item.admin === true,
    }
  }).filter((item) => !!item.show);
});

function onClickClearTokens()
{
  //
}

async function onClickLogout()
{
  if (!confirm('정말 로그아웃 할까요?')) return;
  await logout();
}

/**
 * get navigation element name
 * 메뉴 상태에 따라 링크 엘리먼트 이름 설정하기
 * @param {object} item
 * @return {string}
 */
function getNavigationElementName(item)
{
  if (item.link) return 'router-link';
  else if (item.href) return 'a';
  else return 'span';
}
</script>

<style src="./default.scss" lang="scss" scoped></style>
