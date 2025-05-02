const auth = [
  // login
  {
    path: '/auth/login/',
    name: 'AuthLogin',
    component: () => import('../pages/auth/login.vue'),
    meta: { layout: 'blank', active: 'auth' },
  },
]
const apps = []
const nests = []
const articles = []
const files = []
const json = []
const users = []
const checklist = []
const preference = []
const guide = []

export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/dashboard.vue'),
    meta: { active: 'dashboard' },
  },
  ...auth,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'blank', active: 'service' },
  },
]
