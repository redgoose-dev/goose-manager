<template>
<article
  :class="[
    'login',
    state.theme.blur && 'login--blur',
    state.theme.image ? 'bg--image' : `bg--gradient-${state.theme.gradient}`,
  ]"
  :style="[
    state.theme.image && `--bg-image: url(${state.theme.image})`,
  ]">
  <div class="login__wrap">
    <header class="login__header">
      <h1>{{_title}}</h1>
      <p>{{_description}}</p>
    </header>
    <LoginForm class="login__forms"/>
    <LoginQuick v-if="state.providers.length > 0" :items="state.providers"/>
  </div>
</article>
</template>

<script setup>
import { reactive, inject, computed, onMounted, onBeforeUnmount } from 'vue'
import { localRequest } from '../../libs/api.js'
import { randomNumber } from '../../libs/strings.js'
import { modalRootClassName } from '../../libs/assets.js'
import LoginForm from '../../components/pages/auth/login-form.vue'
import LoginQuick from '../../components/pages/auth/login-quick.vue'

const toast = inject('toast')
const { VITE_APP_TITLE, VITE_APP_DESCRIPTION } = import.meta.env
const state = reactive({
  loading: true,
  providers: [],
  theme: {
    blur: false,
    image: '',
    gradient: 0,
  },
})

const _title = computed(() => {
  return VITE_APP_TITLE || '거위 매니저'
})
const _description = computed(() => {
  return VITE_APP_DESCRIPTION || '컨텐츠 관리 프로그램'
})

onMounted(async () => {
  try
  {
    controlRoot(true)
    const { data } = await localRequest({
      method: 'post',
      url: '/zone/ready/',
    })
    if (data.preference)
    {
      state.theme.blur = data.preference.blur
      state.theme.image = data.preference.image
      state.theme.gradient = data.preference.gradient === 0 ? randomNumber(1, 10) : Math.min(Math.max(data.preference.gradient, 1), 10)
    }
    state.providers = data.providers || []
  }
  catch (e)
  {
    toast.add('로그인을 위한 데이터를 가져오지 못했습니다.', 'error').then()
  }
  finally
  {
    state.loading = false
  }
})
onBeforeUnmount(() => controlRoot(false))

function controlRoot(sw)
{
  document.documentElement.classList[sw ? 'add' : 'remove'](modalRootClassName)
}
</script>

<style src="./login.scss" lang="scss" scoped></style>
