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
const app = [
  {
    path: '/app/',
    name: 'App',
    component: () => import('../pages/app/index.vue'),
    meta: { active: 'app' },
  },
  {
    path: '/app/create/',
    name: 'AppCreate',
    component: () => import('../pages/app/create.vue'),
    meta: { active: 'app' },
  },
  {
    path: '/app/:srl/edit/',
    name: 'AppEdit',
    component: () => import('../pages/app/edit.vue'),
    meta: { active: 'app' },
  },
  {
    path: '/app/:srl/delete/',
    name: 'AppDelete',
    component: () => import('../pages/app/delete.vue'),
    meta: { active: 'app' },
  },
]
const nest = [
  {
    path: '/nest/',
    name: 'Nest',
    component: () => import('../pages/nest/index.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/create/',
    name: 'NestCreate',
    component: () => import('../pages/nest/create.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:srl/edit/',
    name: 'NestEdit',
    component: () => import('../pages/nest/edit.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:srl/delete/',
    name: 'NestDelete',
    component: () => import('../pages/nest/delete.vue'),
    meta: { active: 'nest' },
  },
  // article
  {
    path: '/nest/:nest/article/',
    name: 'NestArticleIndex',
    component: () => import('../pages/nest/article/index.vue'),
    meta: { active: 'nest' },
  },
  // category
  {
    path: '/nest/:nest/category/',
    name: 'NestCategoryIndex',
    component: () => import('../pages/nest/category/index.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:nest/category/create/',
    name: 'NestCategoryCreate',
    component: () => import('../pages/nest/category/create.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:nest/category/:category/edit/',
    name: 'NestCategoryEdit',
    component: () => import('../pages/nest/category/edit.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:nest/category/:category/delete/',
    name: 'NestCategoryDelete',
    component: () => import('../pages/nest/category/delete.vue'),
    meta: { active: 'nest' },
  },
]
const article = []
const file = [
  {
    path: '/file/',
    name: 'File',
    component: () => import('../pages/file/index.vue'),
    meta: { active: 'file' },
  },
]
const json = [
  // category
  {
    path: '/json/category/',
    name: 'JSONCategoryIndex',
    component: () => import('../pages/json/category/index.vue'),
    meta: { active: 'json' },
  },
]
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
        component: () => import('../pages/guide/button.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'forms/',
        name: 'GuideForms',
        component: () => import('../pages/guide/forms.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'fieldset/',
        name: 'GuideFieldset',
        component: () => import('../pages/guide/fieldset.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'icon/',
        name: 'GuideIcon',
        component: () => import('../pages/guide/icon.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'color/',
        name: 'GuideColor',
        component: () => import('../pages/guide/color.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'modal/',
        name: 'GuideModal',
        component: () => import('../pages/guide/modal.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'item/',
        name: 'GuideItem',
        component: () => import('../pages/guide/item.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'etc/',
        name: 'GuideEtc',
        component: () => import('../pages/guide/etc.vue'),
        meta: { active: 'guide' },
      },
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
  ...app,
  ...nest,
  ...article,
  ...file,
  ...json,
  ...checklist,
  ...preference,
  ...(DEV ? guide : []),
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'blank', active: 'service' },
  },
]
