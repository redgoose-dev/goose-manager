export default {
  lang: 'ko',
  navigation: [
    {
      name: 'Modules',
      icon: 'cloud',
      children: [
        {
          name: 'Apps',
          link: '/apps/',
          icon: 'cloud',
        },
        {
          name: 'Nests',
          link: '/nests/',
          icon: 'folder',
        },
        {
          name: 'Users',
          href: '/users/',
          icon: 'user',
        },
        {
          name: 'Files',
          link: '/files/',
          icon: 'file',
        },
        {
          name: 'JSON',
          link: '/json/',
          icon: 'code',
        },
        {
          name: 'Checklist',
          link: '/checklist/',
          icon: 'check'
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
          target: '_blank'
        }
      ]
    },
    {
      name: 'Guide',
      link: '/guide/',
      icon: 'book',
    }
  ],
  dashboard: {},
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
