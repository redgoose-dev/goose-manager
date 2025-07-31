<template>
<ErrorService
  v-if="error"
  :code="500"
  page-title="오류가 발생했습니다."
  :page-message="error?.message || '알 수 없는 오류가 발생했습니다.'"
  :error="error"/>
<component v-else-if="!current.blink && _layout" :is="_layout">
  <router-view/>
</component>
</template>

<script setup>
import { ref, computed, watch, onErrorCaptured, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authStore } from './store/auth.js'
import { currentStore, preferenceStore } from './store/app.js'
import ErrorTrigger from './libs/ErrorTrigger.js'
import ErrorService from './pages/error/index.vue'
import LayoutBlank from './layouts/blank.vue'
import LayoutDefault from './layouts/default.vue'

const router = useRouter()
const route = useRoute()
const auth = authStore()
const current = currentStore()

// set provides
provide('error', new ErrorTrigger())
provide('preference', preferenceStore())
provide('current', current)
provide('auth', auth)

const error = ref(undefined)
const _layout = computed(() => {
  let layoutName = route.meta.layout || 'default'
  if (!route.name) return null
  if (!auth.provider) layoutName = 'blank'
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
