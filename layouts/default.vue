<template>
<main>
  <header class="header">
    <div class="header__wrap content-area">
      <h1 class="header-logo">
        <nuxt-link to="/">{{computedShortName}}</nuxt-link>
      </h1>
      <nav class="header-gnb">
        <ul v-if="computedNavigation.length > 0" class="navigation">
          <li v-for="item in computedNavigation" v-if="item.show">
            <component
              :is="getNavigationElementName(item)"
              :to="item.link"
              :href="item.href"
              :target="item.target">
              <em>{{item.name}}</em>
              <icon v-if="item.icon" :name="item.icon"/>
              <icon v-if="item.children && item.children.length" name="chevron-down" class="flip-y dropdown"/>
            </component>
            <div v-if="item.children && item.children.length">
              <ul>
                <li v-for="item2 in item.children">
                  <component
                    :is="getNavigationElementName(item2)"
                    :to="item2.link"
                    :href="item2.href"
                    :target="item2.target">
                    <em>{{item2.name}}</em>
                    <icon v-if="item2.icon" :name="item2.icon"/>
                    <icon v-if="item2.children && item2.children.length" name="chevron-right" class="dropdown"/>
                  </component>
                  <div v-if="item2.children">
                    <ul>
                      <li v-for="item3 in item2.children">
                        <component
                          :is="getNavigationElementName(item3)"
                          :to="item3.link"
                          :href="item3.href"
                          :target="item3.target">
                          <em>{{item3.name}}</em>
                          <icon v-if="item3.icon" :name="item3.icon"/>
                        </component>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      <nav v-if="!!user" class="header-nav">
        <ul class="navigation navigation--side">
          <li>
            <span>
              <em>{{user.email}}</em>
              <icon name="chevron-down" class="flip-y"/>
            </span>
            <div>
              <ul>
                <li><nuxt-link to="/account/" @click.native="onClickProfileItem">Account</nuxt-link></li>
                <li><span @click.prevent="onClickClearTokens">Clear tokens</span></li>
                <li><nuxt-link to="/auth/logout/">Logout</nuxt-link></li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <div class="container">
    <div class="container__wrap content-area">
      <nuxt/>
    </div>
  </div>
  <footer class="footer">
    <div class="footer__wrap content-area">
      <address>
        Copyright © 2014-{{year}} <a href="https://redgoose.me" target="_blank">redgoose.me</a>
      </address>
    </div>
  </footer>
</main>
</template>

<script>
import * as messages from '~/libs/messages';

export default {
  name: 'layout',
  components: {
    'button-basic': () => import('~/components/button/basic'),
    'icon': () => import('~/components/icon'),
  },
  head()
  {
    const { preference } = this.$store.state;
    return {
      htmlAttrs: {
        lang: preference.lang,
      },
    };
  },
  data()
  {
    const { $store } = this;
    return {
      user: $store.state.authUser || null,
      year: new Date().getFullYear()
    };
  },
  computed: {
    computedShortName()
    {
      const { preference } = this.$store.state;
      return preference.shortName || 'GOOSE';
    },
    computedNavigation()
    {
      const { navigation } = this.$store.state.preference;
      let nav = [];
      nav = navigation.map((item,k) => {
        return {
          ...item,
          show: item.admin === undefined || item.admin === true,
        }
      });
      return nav;
    },
  },
  methods: {
    onClickProfileItem(e)
    {
      e.currentTarget.blur();
    },
    async onClickClearTokens(e)
    {
      // confirm
      if (!confirm(messages.msg.confirmResetToken))
      {
        e.currentTarget.blur();
        return;
      }

      try
      {
        e.currentTarget.blur();
        const res = await this.$axios.$post('/token/clear/');
        if (!res.success) throw 'error';
        alert(messages.msg.successClearToken);
      }
      catch (e)
      {
        this.$toast.add({
          message: messages.msg.errorClearToken,
          color: 'error',
        });
      }
    },
    /**
     * get navigation element name
     * 메뉴 상태에 따라 링크 엘리먼트 이름 설정하기
     *
     * @param {object} item
     * @return {string}
     */
    getNavigationElementName(item)
    {
      if (item.link)
      {
        return 'nuxt-link';
      }
      else if (item.href)
      {
        return 'a';
      }
      else
      {
        return 'span';
      }
    },
  },
}
</script>

<style lang="scss" src="./default.scss" scoped/>
