import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { checkAuth } from '../libs/auth';

/** @var {string} BASE_URL */

const router = createRouter({
  base: BASE_URL || '/',
  history: createWebHistory(),
  routes,
});

// 라우트 업데이트 전 후크
router.beforeEach(async (to, from) => {
  const auth = await checkAuth();
  // redirect screen
  switch (to.name)
  {
    case 'AuthLogin':
      return auth ? '/' : undefined;
    default:
      return auth ? undefined : '/auth/login';
  }
});

// 업데이트 후 후크
router.afterEach((to, from) => {
  // console.log('afterEach()');
});

export default router;
