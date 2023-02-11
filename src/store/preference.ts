import { defineStore } from 'pinia'
import { authStore } from './auth'
import { get, post, formData } from '../libs/api'
import { pureObject } from '../libs/object'
import { changeLanguage } from '../message'
import type { Preference } from './preference.d'

const defaultPreference: Preference = {
  general: {
    lang: 'ko',
  },
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
  nests: {
    uploadFileCount: 20,
    limitUploadFile: 5242880,
    limitUploadFiles: 20971520,
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
  },
  checklist: {
    resetTime: '05:00',
    dateFormat: '{yyyy}-{MM}-{dd} ({week})',
    pageCount: 24,
    pageRange: 10,
    limitUploadFilesCount: 20,
    limitUploadFileSize: 5242880,
  },
}

export const preferenceStore = defineStore('preference', {
  state(): Preference
  {
    return pureObject(defaultPreference)
  },
  getters: {
    pure: ({ general, dashboard, navigation, nests, articles, files, checklist }) => {
      return pureObject({
        general,
        dashboard,
        navigation,
        nests,
        articles,
        files,
        checklist,
      })
    },
  },
  actions: {
    async setup(): Promise<void>
    {
      const auth = authStore()
      if (!auth.user) throw new Error('no user')
      let res = await get(`/users/${auth.user.srl}/`)
      if (!res.success) throw new Error(res.message)
      if (res.data?.json?.manager)
      {
        const { general, dashboard, navigation, nests, articles, files, checklist } = res.data?.json?.manager
        if (general) this.general = general
        if (dashboard) this.dashboard = dashboard
        if (navigation) this.navigation = navigation
        if (nests) this.nests = nests
        if (articles) this.articles = articles
        if (files) this.files = files
        if (checklist) this.checklist = checklist
      }
      await changeLanguage(this.general.lang)
    },
    async save(): Promise<void>
    {
      const auth = authStore()
      let userPref
      // get user
      let user = await get(`/users/${auth.user?.srl}/`, { field: 'json' })
      if (!user.success) throw new Error(user.message)
      if (user.data?.json) userPref = user.data.json
      // update user
      let { success, message } = await post(`/users/${auth.user?.srl}/edit/`, formData({
        json: JSON.stringify({
          ...userPref,
          manager: this.pure,
        }),
      }))
      if (!success) throw new Error(message)
    },
  },
})
