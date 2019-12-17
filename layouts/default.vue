<template>
<main>
  <header class="header">
    <div class="header__wrap content-area">
      <h1 class="header-logo">
        <nuxt-link to="/">
          <img src="/images/txt-logo.svg" alt="GOOSE"/>
        </nuxt-link>
      </h1>
      <nav class="header-gnb">
        <ul v-if="computedNavigation.length > 0">
          <li v-for="(item,k) in computedNavigation" v-if="item.show">
            <nuxt-link v-if="!item.target" :to="item.link">{{item.name}}</nuxt-link>
            <a v-else v-bind:href="item.link" :target="item.target">{{item.name}}</a>
          </li>
        </ul>
      </nav>
      <nav v-if="!!user" class="header-nav">
        <div class="dropdown">
          <span class="dropdown__control">
            <em>{{user.email}}</em>
            <i class="material-icons">arrow_drop_down</i>
          </span>
          <div class="dropdown__children">
            <ul>
              <li>
                <a href="/account" @click.prevent="onClickProfileItem">Account</a>
              </li>
              <li>
                <a href="#" @click.prevent="onClickClearTokens">Clear tokens</a>
              </li>
              <li>
                <nuxt-link to="/auth/logout">Logout</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
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
export default {
  name: 'layout',
  components: {
    'button-basic': () => import('~/components/button/basic'),
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
    computedAppName()
    {
      const { preference } = this.$store.state;
      return preference.appName;
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
      this.$router.push(e.currentTarget.getAttribute('href'));
    },
    async onClickClearTokens(e)
    {
      try
      {
        e.currentTarget.blur();
        const res = await this.$axios.$post('/token/clear');
        if (!res.success) throw 'error';
        alert('Success clear token');
      }
      catch (e)
      {
        this.$toast.add({
          message: 'Error clear token',
          color: 'error',
        });
      }
    },
  },
}
</script>
<style lang="scss" src="./default.scss" scoped/>
