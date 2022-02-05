export default {
  lang: 'ko',
  navigation: [
    {
      name: "Apps",
      link: "/apps/"
    },
    {
      name: "Nests",
      link: "/nests/"
    },
    {
      name: "Users",
      link: "/users/",
      admin: true
    },
    {
      name: "JSON",
      link: "/json/"
    },
    {
      name: "Resource",
      children: [
        {
          name: "GitHub",
          href: "https://github.com/redgoose-dev/goose-manager",
          target: "_blank"
        },
        {
          name: "API Documentation",
          href: "https://github.com/redgoose-dev/goose-api/wiki",
          target: "_blank"
        }
      ]
    },
    {
      name: "Checklist",
      link: "/checklist/",
      icon: "check"
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
