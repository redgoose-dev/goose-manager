<template>
<article class="dashboard">
  <h1>Dashboard</h1>
  <p>Welcome to the dashboard!</p>
  <nav>
    <button
      type="button"
      @click="onClick">
      리퀘스트
    </button>
  </nav>
</article>
</template>

<script setup>
import { ref } from 'vue'
import { authStore } from '../store/auth.js'
import { request } from '../libs/api.js'

const auth = authStore()

async function onClick()
{
  try
  {
    const res = await request('/app/', {
      method: 'get',
    })
    console.log('[DASHBOARD RESPONSE]', res)
  }
  catch (e)
  {
    console.error('[DASHBOARD ERROR]', e.message)
  }
}
</script>

<style src="./dashboard.scss" lang="scss" scoped></style>
