import { createRouter, createWebHistory } from 'vue-router'
import map from './map'
import { authStore } from '../store/auth'

/** @var {string} BASE_URL */

/** @var {Router} router */
const router = createRouter({
  history: createWebHistory(BASE_URL || '/'),
  routes: map,
})

// 라우트 업데이트 전 후크
router.beforeEach(async (to: any) => {
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
