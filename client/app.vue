<template>
<ErrorService v-if="error" :error="error"/>
<component v-else-if="!current.blink && layout" :is="layout">
  <router-view/>
</component>
</template>

<script setup>
import { ref, computed, watch, onErrorCaptured } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authStore } from './store/auth.js'
import { currentStore } from './store/app.js'
import ErrorService from './pages/error/500.vue'
import LayoutBlank from './layouts/blank.vue'
import LayoutDefault from './layouts/default.vue'

const router = useRouter()
const route = useRoute()
const auth = authStore()
const current = currentStore()

const error = ref(undefined)
const layout = computed(() => {
  let layoutName = route.meta.layout || 'default'
  if (!route.name) return null
  // if (!auth.account) layoutName = 'blank' // TODO: 인증부분 구현이 안되어있어서 주석처리
  switch (layoutName)
  {
    case 'default':
      return LayoutDefault
    case 'blank':
    default:
      return LayoutBlank
  }
})

// capture error
onErrorCaptured((e) => {
  if (typeof e === 'string')
  {
    error.value = new Error(e)
  }
  else
  {
    error.value = e
  }
})

// router error
router.onError(e => {
  error.value = e
})

// watch route name
watch(() => route.name, () => {
  // 오류난 화면에서 뒤로가기나 다른페이지로 이동했을때 오류값 초기화하기
  if (!!error.value) error.value = undefined
})
</script>
