const auth = [
  // login
  {
    path: '/auth/login/',
    name: 'AuthLogin',
    component: () => import('../pages/auth/login.vue'),
    meta: { layout: 'blank', active: 'auth' },
  },
];
const apps = [
  {
    path: '/apps/',
    name: 'Apps',
    component: () => import('../pages/apps/index.vue'),
    meta: { active: 'apps' },
  },
  {
    path: '/apps/create/',
    name: 'AppsCreate',
    component: () => import('../pages/apps/create.vue'),
    meta: { active: 'apps' },
  },
  {
    path: '/apps/:srl/edit/',
    name: 'AppsEdit',
    component: () => import('../pages/apps/edit.vue'),
    meta: { active: 'apps' },
  },
  {
    path: '/apps/:srl/delete/',
    name: 'AppsDelete',
    component: () => import('../pages/apps/delete.vue'),
    meta: { active: 'apps' },
  },
];
const nests = [
  {
    path: '/nests/',
    name: 'Nests',
    component: () => import('../pages/nests/index.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/create/',
    name: 'NestsCreate',
    component: () => import('../pages/nests/create.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:srl/',
    name: 'NestsItem',
    component: () => import('../pages/nests/item.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:srl/edit/',
    name: 'NestsEdit',
    component: () => import('../pages/nests/edit.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:srl/delete/',
    name: 'NestsDelete',
    component: () => import('../pages/nests/delete.vue'),
    meta: { active: 'nests' },
  },
  // articles
  {
    path: '/nests/:nestSrl/articles/',
    name: 'NestsArticles',
    component: () => import('../pages/nests/articles/index.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/articles/create/',
    name: 'NestsCreateArticle',
    component: () => import('../pages/nests/articles/create.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/articles/:articleSrl/',
    name: 'NestsArticle',
    component: () => import('../pages/nests/articles/item.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/articles/:articleSrl/edit/',
    name: 'NestsEditArticle',
    component: () => import('../pages/nests/articles/edit.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/articles/:articleSrl/delete/',
    name: 'NestsDeleteArticle',
    component: () => import('../pages/nests/articles/delete.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/articles/:articleSrl/change-nest/',
    name: 'NestsChangeNestArticle',
    component: () => import('../pages/nests/articles/change-nest.vue'),
    meta: { active: 'nests' },
  },
  // categories
  {
    path: '/nests/:nestSrl/categories/',
    name: 'NestsCategories',
    component: () => import('../pages/nests/categories/index.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/categories/create/',
    name: 'NestsCreateCategory',
    component: () => import('../pages/nests/categories/create.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/categories/:categorySrl/edit/',
    name: 'NestsEditCategory',
    component: () => import('../pages/nests/categories/edit.vue'),
    meta: { active: 'nests' },
  },
  {
    path: '/nests/:nestSrl/categories/:categorySrl/delete/',
    name: 'NestsDeleteCategory',
    component: () => import('../pages/nests/categories/delete.vue'),
    meta: { active: 'nests' },
  },
];
const articles = [
  {
    path: '/articles/',
    name: 'Articles',
    component: () => import('../pages/articles/index.vue'),
    meta: { active: 'articles' },
  },
  {
    path: '/articles/:srl/',
    name: 'Article',
    component: () => import('../pages/articles/item.vue'),
    meta: { active: 'articles' },
  },
  {
    path: '/articles/:srl/edit/',
    name: 'EditArticle',
    component: () => import('../pages/articles/edit.vue'),
    meta: { active: 'articles' },
  },
  {
    path: '/articles/:srl/delete/',
    name: 'DeleteArticle',
    component: () => import('../pages/articles/delete.vue'),
    meta: { active: 'articles' },
  },
  {
    path: '/articles/:articleSrl/change-nest/',
    name: 'ChangeNestArticle',
    component: () => import('../pages/articles/change-nest.vue'),
    meta: { active: 'articles' },
  },
];
const files = [
  {
    path: '/files/',
    name: 'Files',
    component: () => import('../pages/files/index.vue'),
    meta: { active: 'files' },
  },
];
const json = [
  {
    path: '/json/',
    name: 'Json',
    component: () => import('../pages/json/index.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/create/',
    name: 'JsonCreate',
    component: () => import('../pages/json/create.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/:srl/',
    name: 'JsonItem',
    component: () => import('../pages/json/item.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/:srl/edit/',
    name: 'JsonEdit',
    component: () => import('../pages/json/edit.vue'),
    meta: { active: 'json' },
  },
  {
    path: '/json/:srl/delete/',
    name: 'JsonDelete',
    component: () => import('../pages/json/delete.vue'),
    meta: { active: 'json' },
  },
];
const users = [
  {
    path: '/users/',
    name: 'Users',
    component: () => import('../pages/users/index.vue'),
    meta: { active: 'users' },
  },
  {
    path: '/users/:srl/',
    name: 'UsersItem',
    component: () => import('../pages/users/item.vue'),
    meta: { active: 'users' },
  },
  {
    path: '/users/:srl/edit/',
    name: 'UsersEdit',
    component: () => import('../pages/users/edit.vue'),
    meta: { active: 'users' },
  },
  {
    path: '/users/:srl/delete/',
    name: 'UsersDelete',
    component: () => import('../pages/users/delete.vue'),
    meta: { active: 'users' },
  },
  {
    path: '/users/create/',
    name: 'UsersCreate',
    component: () => import('../pages/users/create.vue'),
    meta: { active: 'users' },
  },
  {
    path: '/users/:srl/change-password/',
    name: 'UsersChangePassword',
    component: () => import('../pages/users/change-password.vue'),
    meta: { active: 'users' },
  },
];
const checklist = [
  {
    path: '/checklist/',
    name: 'Checklist',
    component: () => import('../pages/checklist/index.vue'),
    meta: { active: 'checklist' },
  },
  {
    path: '/checklist/list/',
    name: 'ChecklistList',
    component: () => import('../pages/checklist/list.vue'),
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
    name: 'ChecklistItem',
    component: () => import('../pages/checklist/item.vue'),
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
];
const preference = [
  {
    path: '/preference/',
    name: 'Preference',
    component: () => import('../pages/preference/index.vue'),
    meta: { active: 'preference' },
    children: [
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
        path: 'nests/',
        name: 'PreferenceNests',
        component: () => import('../pages/preference/nests.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'articles/',
        name: 'PreferenceArticles',
        component: () => import('../pages/preference/articles.vue'),
        meta: { active: 'preference' },
      },

      {
        path: 'files/',
        name: 'PreferenceFiles',
        component: () => import('../pages/preference/files.vue'),
        meta: { active: 'preference' },
      },
      {
        path: 'checklist/',
        name: 'PreferenceChecklist',
        component: () => import('../pages/preference/checklist.vue'),
        meta: { active: 'preference' },
      },
    ],
  }
];
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
      {
        path: 'form/',
        name: 'GuideForm',
        component: () => import('../pages/guide/guide-form.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'fieldset/',
        name: 'GuideFieldset',
        component: () => import('../pages/guide/guide-fieldset.vue'),
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
];

export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/index.vue'),
    meta: { active: 'dashboard' },
  },
  ...auth,
  ...apps,
  ...nests,
  ...articles,
  ...files,
  ...json,
  ...users,
  ...checklist,
  ...preference,
  ...guide,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'blank', active: 'service' },
  },
];
