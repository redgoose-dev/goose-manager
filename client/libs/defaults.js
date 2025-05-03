const { DEV } = import.meta.env

export const defaultPreference = {
  general: {},
  dashboard: {
    title: 'Dashboard',
    description: 'Welcome to goose manager',
    contents: [
      {
        module: 'articles',
        options: { size: 8 },
      },
      {
        module: 'nests',
        options: { size: 12 },
      },
      {
        module: 'apps',
        options: { size: 6 },
      },
      {
        module: 'json',
        options: { size: 4 },
      },
    ],
  },
  navigation: [
    {
      name: 'Modules',
      icon: 'box',
      children: [
        {
          name: 'Apps',
          link: '/apps/',
          icon: 'cloud',
          active: 'apps',
        },
        {
          name: 'Nests',
          link: '/nests/',
          icon: 'folder',
          active: 'nests',
        },
        {
          name: 'Articles',
          link: '/articles/',
          icon: 'droplet',
          active: 'articles',
        },
        {
          name: 'Users',
          link: '/users/',
          icon: 'user',
          active: 'users',
        },
        {
          name: 'Files',
          link: '/files/',
          icon: 'file',
          active: 'files',
        },
        {
          name: 'JSON',
          link: '/json/',
          icon: 'code',
          active: 'json',
        },
      ],
    },
    {
      name: 'Checklist',
      link: '/checklist/',
      icon: 'check-square',
      active: 'checklist',
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
          href: 'https://github.com/redgoose-dev/goose-api/wiki',
          target: '_blank',
          icon: 'server',
        }
      ]
    },
    DEV && {
      name: 'Guide',
      link: '/guide/',
      icon: 'book',
      active: 'guide',
    },
  ].filter(Boolean),
  nests: {
    uploadFileCount: 100,
    limitUploadFile: 5242880,
    limitUploadFiles: 31457280,
  },
  articles: {
    pageCount: 24,
    pageRange: 10,
    displayDateField: 'regdate',
  },
  files: {
    pagePerSize: 24,
    acceptFileType: 'image/*,audio/*,video/*,text/*,.pdf',
    globalPath: 'assets',
    limitCount: 100,
    limitSize: 5242880,
  },
  checklist: {
    resetTime: '05:00',
    dateFormat: '{yyyy}-{MM}-{dd} ({week})',
    pageCount: 24,
    pageRange: 10,
    limitUploadFilesCount: 100,
    limitUploadFileSize: 31457280,
  },
}
