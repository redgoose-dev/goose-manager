<template>
<article class="login">
  <div class="login__wrap">
    <header class="login__header">
      <h1>{{_title}}</h1>
      <p>{{_description}}</p>
    </header>
    <LoginForm class="login__forms"/>
    <LoginQuick
      v-if="providers.length > 0"
      :items="providers"/>
  </div>
</article>
</template>

<script setup>
import { ref, reactive, inject, computed, onMounted } from 'vue'
import { localRequest } from '../../libs/api.js'
import LoginForm from '../../components/pages/auth/login-form.vue'
import LoginQuick from '../../components/pages/auth/login-quick.vue'

const toast = inject('toast')
const { VITE_APP_TITLE, VITE_APP_DESCRIPTION } = import.meta.env
const loading = ref(false)
const providers = ref([])

const _title = computed(() => {
  return VITE_APP_TITLE || '거위 매니저'
})
const _description = computed(() => {
  return VITE_APP_DESCRIPTION || '컨텐츠 관리 프로그램'
})

onMounted(async () => {
  try
  {
    loading.value = true
    const res = await localRequest({
      method: 'post',
      url: '/zone/ready/',
    })
    providers.value = res.data
  }
  catch (e)
  {
    console.error('[ERROR] ', e)
    // toast.add('로그인을 위한 데이터를 가져오지 못했습니다.', 'error').then()
  }
  finally
  {
    loading.value = false
  }
})
</script>

<style src="./login.scss" lang="scss" scoped></style>
