<template>
<ErrorService v-if="error" :error="error"/>
<component v-else-if="!head.blink && layout" :is="layout">
  <router-view/>
</component>
</template>

<script setup>
import { computed, ref, watch, onErrorCaptured } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authStore } from './store/auth'
import { headStore } from './store/head'
import { filtersStore } from './store/filters'
import { err } from './libs/error'
import { markedSetup } from './modules/marked'
import ErrorService from './pages/error/500.vue'
import LayoutBlank from './layouts/blank.vue'
import LayoutDefault from './layouts/default.vue'

const router = useRouter()
const route = useRoute()
const auth = authStore()
const head = headStore()
const filters = filtersStore()
const error = ref(undefined)
const layout = computed(() => {
  let layoutName = route.meta.layout || 'default'
  if (!route.name) return null
  if (!auth.user) layoutName = 'blank'
  switch (layoutName) {
    case 'default':
      return LayoutDefault
    case 'blank':
    default:
      return LayoutBlank
  }
})

// children component error
if (!import.meta.env.DEV)
{
  onErrorCaptured((e) => {
    if (typeof e === 'string')
    {
      error.value = new Error(e.message)
    }
    else
    {
      err([ '/app.vue', 'onErrorCaptured()' ], 'error', e.message)
      error.value = e
    }
  })
}

// setup markdown parser
markedSetup()

// change theme
head.changeTheme()

// setup filters
filters.setup()

// router error
router.onError(e => {
  err([ '/app.vue', 'router.onError()' ], 'error', e.message)
  error.value = e
})

// watch route name
watch(() => route.name, () => {
  // 오류난 화면에서 뒤로가기나 다른페이지로 이동했을때 오류값 초기화하기
  if (!!error.value) error.value = undefined
})
</script>
