const auth = [
  // login
  {
    path: '/auth/login/',
    name: 'AuthLogin',
    component: () => import('../pages/auth/login.vue'),
    meta: { layout: 'blank' },
  },
];
const guide = [
  {
    path: '/guide/',
    name: 'Guide',
    component: () => import('../pages/guide/index.vue'),
    children: [
      {
        path: 'button/',
        name: 'GuideButton',
        component: () => import('../pages/guide/button.vue'),
      },
      {
        path: 'form/',
        name: 'GuideForm',
        component: () => import('../pages/guide/form.vue'),
      },
      {
        path: 'fieldset/',
        name: 'GuideFieldset',
        component: () => import('../pages/guide/fieldset.vue'),
      },
      {
        path: 'icon/',
        name: 'GuideIcon',
        component: () => import('../pages/guide/icon.vue'),
      },
      {
        path: 'color/',
        name: 'GuideColor',
        component: () => import('../pages/guide/color.vue'),
      },
      {
        path: 'file/',
        name: 'GuideFile',
        component: () => import('../pages/guide/file.vue'),
      },
      {
        path: 'modal/',
        name: 'GuideModal',
        component: () => import('../pages/guide/modal.vue'),
      },
      {
        path: 'item/',
        name: 'GuideItem',
        component: () => import('../pages/guide/item.vue'),
      },
      {
        path: 'etc/',
        name: 'GuideEtc',
        component: () => import('../pages/guide/etc.vue'),
      },
    ],
  },
];
const apps = [
  {
    path: '/apps/',
    name: 'Apps',
    component: () => import('../pages/apps/index.vue'),
  },
  {
    path: '/apps/create/',
    name: 'AppsCreate',
    component: () => import('../pages/apps/create.vue'),
  },
  {
    path: '/apps/:srl/edit/',
    name: 'AppsEdit',
    component: () => import('../pages/apps/edit.vue'),
  },
  {
    path: '/apps/:srl/delete/',
    name: 'AppsDelete',
    component: () => import('../pages/apps/delete.vue'),
  },
];
const nests = [];
const articles = [];
const categories = [];
const files = [];

export default [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/index.vue'),
  },
  ...auth,
  ...apps,
  ...nests,
  ...guide,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error/404.vue'),
    meta: { layout: 'blank' },
  },
];
