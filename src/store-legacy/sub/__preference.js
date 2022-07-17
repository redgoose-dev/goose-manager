import store from '../../store-legacy';
import { get, post, formData } from '../../libs/api';
import { pureObject } from '../../libs/object';
import { changeLanguage } from '../../message';

/**
 * default preference
 * @return {object}
 */
export function defaultPreference()
{
  return {
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
  };
}

/**
 * setup preference
 * @return {Promise<void>}
 */
export async function setupPreference()
{
  let res = await get(`/users/${store.state.user.srl}/`);
  if (!res.success) throw new Error(res.message);
  if (res.data.json?.manager)
  {
    store.state.preference = res.data.json.manager;
  }
  changeLanguage(store.state.preference.general.lang);
}

/**
 * save preference
 * @return {Promise<void>}
 */
export async function savePreference()
{
  const pref = pureObject(store.state.preference);
  let userPref;
  // get user
  let user = await get(`/users/${store.state.user.srl}/`, { field: 'json' });
  if (!user.success) throw new Error(user.message);
  if (user.data.json) userPref = user.data.json;
  // update user
  let res = await post(`/users/${store.state.user.srl}/edit/`, formData({
    json: encodeURIComponent(JSON.stringify({
      ...userPref,
      manager: pref,
    })),
  }));
  if (!res.success) throw new Error(res.message);
}
