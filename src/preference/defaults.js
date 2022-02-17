export default {
  lang: 'ko',
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
        {
          name: 'Checklist',
          link: '/checklist/',
          icon: 'check',
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
          icon: 'github',
        },
        {
          name: 'API Documentation',
          href: 'https://github.com/redgoose-dev/goose-api/wiki',
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
  dashboard: {},
  apps: {},
  nests: {},
  articles: {
    pageCount: 24,
    pageRange: 10,
    displayDateField: 'regdate',
    filter: {
      type: 'all',
      order: 'srl',
      sort: 'desc',
      skin: 'card'
    },
  },
  files: {
    pageCount: 24,
  },
  users: {},
  checklist: {
    reset: '05:00',
    format: '{yyyy}-{MM}-{dd} ({week})',
    range: {
      year: [ 2020, 2030, 2040, 2050 ],
    },
    filter: {
      year: '',
      month: '',
      sort: 'desc'
    }
  },
};
