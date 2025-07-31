import ErrorService from '../pages/error/index.vue'

const { DEV } = import.meta.env

const auth = [
  // login
  {
    path: '/auth/login/',
    name: 'AuthLogin',
    component: () => import('../pages/auth/login.vue'),
    meta: { layout: 'blank', active: 'login' },
  },
  // account
  {
    path: '/auth/account/',
    name: 'AuthAccount',
    component: () => import('../pages/auth/account.vue'),
    meta: { active: 'account' },
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
  {
    path: '/nest/:nest/article/create/',
    name: 'NestArticleCreate',
    component: () => import('../pages/nest/article/create.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:nest/article/:article/',
    name: 'NestArticleDetail',
    component: () => import('../pages/nest/article/detail.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:nest/article/:article/edit/',
    name: 'NestArticleEdit',
    component: () => import('../pages/nest/article/edit.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:nest/article/:article/delete/',
    name: 'NestArticleDelete',
    component: () => import('../pages/nest/article/delete.vue'),
    meta: { active: 'nest' },
  },
  {
    path: '/nest/:nest/article/:article/change-nest/',
    name: 'NestArticleChangeNest',
    component: () => import('../pages/nest/article/change-nest.vue'),
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
const article = [
  {
    path: '/article/',
    name: 'ArticleIndex',
    component: () => import('../pages/article/index.vue'),
    meta: { active: 'article' },
  },
  {
    path: '/article/:article/',
    name: 'ArticleDetail',
    component: () => import('../pages/article/detail.vue'),
    meta: { active: 'article' },
  },
  {
    path: '/article/:article/edit/',
    name: 'ArticleEdit',
    component: () => import('../pages/article/edit.vue'),
    meta: { active: 'article' },
  },
  {
    path: '/article/:article/delete/',
    name: 'ArticleDelete',
    component: () => import('../pages/article/delete.vue'),
    meta: { active: 'article' },
  },
]
const file = [
  {
    path: '/file/',
    name: 'File',
    component: () => import('../pages/file/index.vue'),
    meta: { active: 'file' },
  },
]
const json = [
  {
    path: '/json/',
    name: 'JSON',
    component: () => import('../pages/json/index.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/create/',
    name: 'JSONCreate',
    component: () => import('../pages/json/create.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/:srl/',
    name: 'JSONDetail',
    component: () => import('../pages/json/detail.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/:srl/edit/',
    name: 'JSONEdit',
    component: () => import('../pages/json/edit.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/:srl/delete/',
    name: 'JSONDelete',
    component: () => import('../pages/json/delete.vue'),
    meta: { active: 'json' },
  },
  // category
  {
    path: '/json/category/',
    name: 'JSONCategoryIndex',
    component: () => import('../pages/json/category/index.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/category/create/',
    name: 'JSONCategoryCreate',
    component: () => import('../pages/json/category/create.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/category/:category/edit/',
    name: 'JSONCategoryEdit',
    component: () => import('../pages/json/category/edit.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/category/:category/delete/',
    name: 'JSONCategoryDelete',
    component: () => import('../pages/json/category/delete.vue'),
    meta: { active: 'json' },
  },
]
const checklist = [
  {
    path: '/checklist/',
    name: 'Checklist',
    component: () => import('../pages/checklist/today.vue'),
    meta: { active: 'checklist' },
  },
  {
    path: '/checklist/index/',
    name: 'ChecklistList',
    component: () => import('../pages/checklist/index.vue'),
    meta: { active: 'checklist' },
  },
  {
    path: '/checklist/edit/',
    name: 'ChecklistEditToday',
    component: () => import('../pages/checklist/edit.vue'),
    meta: { active: 'checklist' },
  },
  {
    path: '/checklist/:srl/',
    name: 'ChecklistDetail',
    component: () => import('../pages/checklist/detail.vue'),
    meta: { active: 'checklist' },
  },
  {
    path: '/checklist/:srl/edit/',
    name: 'ChecklistEdit',
    component: () => import('../pages/checklist/edit.vue'),
    meta: { active: 'checklist' },
  },
  {
    path: '/checklist/:srl/delete/',
    name: 'ChecklistDelete',
    component: () => import('../pages/checklist/delete.vue'),
    meta: { active: 'checklist' },
  },
]
const tag = [
  {
    path: '/tag/:module/',
    name: 'Tag',
    component: () => import('../pages/tag/index.vue'),
    meta: { active: 'tag' },
  },
]
const preference = [
  {
    path: '/preference/',
    name: 'Preference',
    component: () => import('../pages/preference/index.vue'),
    meta: { active: 'preference' },
    children: [
      {
        path: '',
        name: 'PreferenceBasic',
        component: () => import('../pages/preference/basic.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'dashboard/',
        name: 'PreferenceDashboard',
        component: () => import('../pages/preference/dashboard.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'navigation/',
        name: 'PreferenceNavigation',
        component: () => import('../pages/preference/navigation.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'nest/',
        name: 'PreferenceNest',
        component: () => import('../pages/preference/nest.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'article/',
        name: 'PreferenceArticle',
        component: () => import('../pages/preference/article.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'file/',
        name: 'PreferenceFile',
        component: () => import('../pages/preference/file.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'checklist/',
        name: 'PreferenceChecklist',
        component: () => import('../pages/preference/checklist.vue'),
        meta: { active: 'preference' },
      },
    ],
  },
]
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
    component: () => import('../pages/dashboard/index.vue'),
    meta: { active: 'dashboard' },
  },
  ...auth,
  ...app,
  ...nest,
  ...article,
  ...file,
  ...json,
  ...checklist,
  ...tag,
  ...preference,
  ...(DEV ? guide : []),
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorService,
    props: {
      code: 404,
      pageTitle: '페이지가 없습니다.',
      pageMessage: '현재 페이지가 없거나 주소가 잘못되었습니다.',
    },
    meta: { layout: 'blank', active: 'service' },
  },
]
