export const defaultPreference = {
  general: {},
  dashboard: {
    title: 'Dashboard',
    description: 'Welcome to goose manager',
    contents: [
      {
        module: 'article',
        params: { size: 8 },
      },
      {
        module: 'nest',
        params: { size: 12 },
      },
      {
        module: 'app',
        params: { size: 6 },
      },
      {
        module: 'json',
        params: { size: 4 },
      },
    ],
  },
  nest: {
    uploadFileCount: 100,
    limitUploadFile: 5242880,
    limitUploadFiles: 31457280,
  },
  article: {
    pageCount: 24,
    pageRange: 10,
    displayDateField: 'created_at',
  },
  json: {
    pageCount: 24,
    pageRange: 10,
  },
  file: {
    pagePerSize: 24,
    acceptFileType: 'image/*,audio/*,video/*,text/*,.pdf',
    limitCount: 100,
    limitSize: 5242880,
  },
  checklist: {
    resetTime: '05:00',
    dateFormat: '{yyyy}-{MM}-{dd} ({week})',
    pageCount: 24,
    pageRange: 10,
  },
  navigation: [
    {
      name: 'Modules',
      icon: 'box',
      children: [
        {
          name: 'App',
          link: '/app/',
          icon: 'cloud',
          active: 'app',
        },
        {
          name: 'Nest',
          link: '/nest/',
          icon: 'folder',
          active: 'nest',
        },
        {
          name: 'Article',
          link: '/article/',
          icon: 'droplet',
          active: 'article',
        },
        {
          name: 'File',
          link: '/file/',
          icon: 'file',
          active: 'file',
        },
        {
          name: 'JSON',
          link: '/json/',
          icon: 'code',
          active: 'json',
        },
        {
          name: 'Checklist',
          link: '/checklist/',
          icon: 'check-square',
          active: 'checklist',
        },
      ],
    },
    {
      name: 'Resource',
      icon: 'link',
      children: [
        {
          name: 'GitHub',
          href: 'https://github.com/redgoose-dev/goose-manager',
          target: '_blank',
          icon: 'folder-git-2',
        },
        {
          name: 'API Documentation',
          href: 'https://github.com/redgoose-dev/goose-api',
          target: '_blank',
          icon: 'server',
        }
      ]
    },
    {
      name: 'Guide',
      link: '/guide/',
      icon: 'book',
      active: 'guide',
    }
  ],
  login: {
    gradient: 1, // 1~10
    image: '',
    blur: false,
  },
}
