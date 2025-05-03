const { DEV } = import.meta.env

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
const guide = [
  {
    path: '/guide/',
    name: 'Guide',
    component: () => import('../pages/guide/index.vue'),
    meta: { active: 'guide' },
    children: [
      {
        path: 'button/',
        name: 'GuideButton',
        component: () => import('../pages/guide/guide-button.vue'),
        meta: { active: 'guide' },
      },
      // {
      //   path: 'form/',
      //   name: 'GuideForm',
      //   component: () => import('../pages/guide/guide-form.vue'),
      //   meta: { active: 'guide' },
      // },
      // {
      //   path: 'fieldset/',
      //   name: 'GuideFieldset',
      //   component: () => import('../pages/guide/guide-fieldset.vue'),
      //   meta: { active: 'guide' },
      // },
      {
        path: 'icon/',
        name: 'GuideIcon',
        component: () => import('../pages/guide/icon.vue'),
        meta: { active: 'guide' },
      },
      // {
      //   path: 'color/',
      //   name: 'GuideColor',
      //   component: () => import('../pages/guide/color.vue'),
      //   meta: { active: 'guide' },
      // },
      // {
      //   path: 'modal/',
      //   name: 'GuideModal',
      //   component: () => import('../pages/guide/modal.vue'),
      //   meta: { active: 'guide' },
      // },
      // {
      //   path: 'item/',
      //   name: 'GuideItem',
      //   component: () => import('../pages/guide/item.vue'),
      //   meta: { active: 'guide' },
      // },
      // {
      //   path: 'etc/',
      //   name: 'GuideEtc',
      //   component: () => import('../pages/guide/etc.vue'),
      //   meta: { active: 'guide' },
      // },
    ],
  },
]

export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/dashboard.vue'),
    meta: { active: 'dashboard' },
  },
  ...auth,
  ...(DEV ? guide : []),
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'blank', active: 'service' },
  },
]
