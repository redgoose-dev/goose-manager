import { get } from '../../libs/api';
import { getDate } from '../../libs/date';
import { createFullPath } from '../files/util';

/**
 * request articles
 * @param {string} size
 * @return {Promise<{module: string, index: object[]}>}
 */
async function requestArticles({ size })
{
  let res = await get('/articles/', {
    field: 'srl,category_srl,title,hit,star,type,json,`order`',
    order: 'srl',
    sort: 'desc',
    size,
    visible_type: 'all',
  });
  if (!res.success) throw new Error(res.message);
  return {
    module: 'articles',
    index: res.data.index.map(item => {
      return {
        srl: item.srl,
        title: item.title,
        href: `/articles/${item.srl}/`,
        meta: [
          item.type.charAt(0).toUpperCase() + item.type.slice(1),
          item.order,
          `Hit: ${item.hit}`,
          `Like: ${item.star}`,
        ],
        image: createFullPath(item.json?.thumbnail?.path),
      };
    }),
  };
}

/**
 * request nests
 * @param {string} size
 * @return {Promise<{module: string, index: object[]}>}
 */
async function requestNests({ size })
{
  let res = await get('/nests/', {
    field: 'srl,id,name,regdate,json',
    order: 'srl',
    sort: 'desc',
    size,
  });
  if (!res.success) throw new Error(res.message);
  return {
    module: 'nests',
    index: res.data.index.map(item => {
      return {
        srl: item.srl,
        title: item.name,
        href: `/nests/${item.srl}/articles/`,
        meta: [
          `srl: ${item.srl}`,
          `id: ${item.id}`,
          getDate(item.regdate),
        ],
        useCategory: Number(item.json.useCategory) === 1,
      };
    }),
  };
}

/**
 * request apps
 * @param {string} size
 * @return {Promise<{module: string, index: object[]}>}
 */
async function requestApps({ size })
{
  let res = await get('/apps/', {
    field: 'srl,id,name,regdate',
    order: 'srl',
    sort: 'desc',
    size,
  });
  if (!res.success) throw new Error(res.message);
  return {
    module: 'apps',
    index: res.data.index.map(item => {
      return {
        srl: item.srl,
        title: item.name,
        meta: [
          `srl: ${item.srl}`,
          `id: ${item.id}`,
          getDate(item.regdate),
        ],
      };
    }),
  };
}

/**
 * request json
 * @param {string} size
 * @return {Promise<{module: string, index: object[]}>}
 */
async function requestJSON({ size })
{
  let res = await get('/json/', {
    field: 'srl,name,regdate',
    order: 'srl',
    sort: 'desc',
    size,
  });
  if (!res.success) throw new Error(res.message);
  return {
    module: 'json',
    index: res.data.index.map(item => {
      return {
        srl: item.srl,
        title: item.name,
        href: `/json/${item.srl}/`,
        meta: [
          `srl: ${item.srl}`,
          getDate(item.regdate),
        ],
      };
    }),
  };
}

/**
 * get data
 * @param {Array} modules
 * @returns {Promise<object[]>}
 */
export async function getData(modules)
{
  const queue = modules.map(o => {
    switch (o.module)
    {
      case 'articles':
        return requestArticles(o.options);
      case 'nests':
        return requestNests(o.options);
      case 'apps':
        return requestApps(o.options);
      case 'json':
        return requestJSON(o.options);
    }
  }).filter(Boolean);
  return await Promise.all(queue);
}
