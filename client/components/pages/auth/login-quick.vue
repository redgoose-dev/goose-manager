<template>
<article class="quick-login">
  <h1>빠른 로그인</h1>
  <nav class="sns">
    <button
      v-if="_providers['discord']"
      type="button"
      title="디스코드로 로그인"
      @click="onClickButton('discord')">
      <img :src="imgLogoDiscord" alt=""/>
    </button>
    <button
      v-if="_providers['github']"
      type="button"
      title="깃허브로 로그인"
      @click="onClickButton('github')">
      <img :src="imgLogoGithub" alt=""/>
    </button>
    <button
      v-if="_providers['google']"
      type="button"
      title="구글로 로그인"
      @click="onClickButton('google')">
      <img :src="imgLogoGoogle" alt=""/>
    </button>
  </nav>
</article>
</template>

<script setup>
import { computed } from 'vue'
import imgLogoDiscord from './assets/ico-logo-discord.svg'
import imgLogoGithub from './assets/ico-logo-github.svg'
import imgLogoGoogle from './assets/ico-logo-google.svg'

const props = defineProps({
  items: Array,
})

const _providers = computed(() => {
  return props.items.reduce((acc, cur) => {
    if (cur.auth_url)
    {
      acc[cur.name] = { url: cur.auth_url || null }
    }
    return acc
  }, {})
})

function onClickButton(key)
{
  if (!_providers.value[key]?.url) return
  location.href = _providers.value[key]?.url
}
</script>

<style src="./login-quick.scss" lang="scss" scoped></style>
