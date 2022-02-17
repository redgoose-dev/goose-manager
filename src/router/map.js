const auth = [
  // login
  {
    path: '/auth/login/',
    name: 'AuthLogin',
    component: () => import('../pages/auth/login.vue'),
    meta: { layout: 'blank', active: 'auth' },
  },
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
        component: () => import('../pages/guide/button.vue'),
        meta: { active: 'guide' },
      },
      {
        path: 'form/',
        name: 'GuideForm',
        component: () => import('../pages/guide/form.vue'),
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
        path: 'file/',
        name: 'GuideFile',
        component: () => import('../pages/guide/file.vue'),
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
const nests = [];
const articles = [];
const categories = [];
const files = [];
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
  ...categories,
  ...files,
  ...users,
  ...guide,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'blank', active: 'service' },
  },
];
