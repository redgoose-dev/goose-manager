import { createRouter, createWebHistory } from 'vue-router'
import map from './map.js'
import { authStore } from '../store/auth.js'

/** @var {Router} router */
const router = createRouter({
  history: createWebHistory('/'),
  routes: map,
})

// 라우트 업데이트 전 후크
router.beforeEach(async (to, _from) => {
  return true // TODO: 작업중이므로 인증은 일단 패스
  const auth = authStore()
  const checkAuth = await auth.checkin()
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
