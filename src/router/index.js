import { createRouter, createWebHistory } from 'vue-router';
import map from './map';
import { checkAuth } from '../libs/auth';
import { getPath } from '../libs/string';

/** @var {string} BASE_URL */

/** @var {Router} router */
const router = createRouter({
  history: createWebHistory(BASE_URL || '/'),
  routes: map,
});

// 라우트 업데이트 전 후크
router.beforeEach(async (to, from) => {
  const auth = await checkAuth();
  // redirect screen
  switch (to.name)
  {
    case 'AuthLogin':
      return auth ? getPath(`${BASE_URL}/`) : undefined;
    default:
      return auth ? undefined : getPath(`${BASE_URL}/auth/login/`);
  }
});

// 업데이트 후 후크
// router.afterEach((to, from) => {
//   console.log('afterEach()');
// });

export default router;
