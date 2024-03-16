import { createRouter, createWebHistory } from 'vue-router'
import map from './map'
import { authStore } from '../store/auth'

const { VITE_BASE_URL } = import.meta.env

/** @var {Router} router */
const router = createRouter({
  history: createWebHistory(VITE_BASE_URL || '/'),
  routes: map,
})

// 라우트 업데이트 전 후크
router.beforeEach(async (to, _from) => {
  const auth = authStore()
  const checkAuth = await auth.check()
  // redirect screen
  switch (to.name)
  {
    case 'AuthLogin':
      return checkAuth ? '/' : undefined
    default:
      return checkAuth ? undefined : '/auth/login/'
  }
})

// 업데이트 후 후크
// router.afterEach((to, from) => {
//   console.log('afterEach()')
// })

export default router
