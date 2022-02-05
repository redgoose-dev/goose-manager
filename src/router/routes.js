const auth = [
  // login
  {
    path: '/auth/login',
    name: 'AuthLogin',
    component: () => import('../pages/auth/login.vue'),
    meta: { layout: 'blank' },
  },
];

export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/index.vue'),
  },
  ...auth,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'blank' },
  },
];
