import { get } from '../../libs/api'
import { getDate } from '../../libs/date'
import { createFullPath } from '../files/util'
import type { Module } from './index.d'

async function requestArticles({ size }: AnyObject = {}): Promise<AnyObject>
{
  let { success, message, data } = await get('/articles/', {
    field: 'srl,category_srl,title,hit,star,type,json,`order`',
    order: 'srl',
    sort: 'desc',
    size,
    visible_type: 'all',
  })
  if (!success) throw new Error(message)
  return {
    module: 'articles',
    index: (data as AnyObject).index.map((item: AnyObject) => {
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
  }
}

async function requestNests({ size }: AnyObject = {}): Promise<AnyObject>
{
  let { success, message, data } = await get('/nests/', {
    field: 'srl,id,name,regdate,json',
    order: 'srl',
    sort: 'desc',
    size,
  })
  if (!success) throw new Error(message)
  return {
    module: 'nests',
    index: (data as AnyObject).index.map((item: AnyObject) => {
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
      }
    }),
  }
}

async function requestApps({ size }: AnyObject = {}): Promise<AnyObject>
{
  let { success, message, data } = await get('/apps/', {
    field: 'srl,id,name,regdate',
    order: 'srl',
    sort: 'desc',
    size,
  })
  if (!success) throw new Error(message)
  return {
    module: 'apps',
    index: (data as AnyObject).index.map((item: AnyObject) => {
      return {
        srl: item.srl,
        title: item.name,
        meta: [
          `srl: ${item.srl}`,
          `id: ${item.id}`,
          getDate(item.regdate),
        ],
      }
    }),
  }
}

async function requestJSON({ size }: AnyObject = {}): Promise<AnyObject>
{
  let { success, message, data } = await get('/json/', {
    field: 'srl,name,regdate',
    order: 'srl',
    sort: 'desc',
    size,
  })
  if (!success) throw new Error(message)
  return {
    module: 'json',
    index: (data as AnyObject).index.map((item: AnyObject) => {
      return {
        srl: item.srl,
        title: item.name,
        href: `/json/${item.srl}/`,
        meta: [
          `srl: ${item.srl}`,
          getDate(item.regdate),
        ],
      }
    }),
  }
}

export async function getData(modules: Module[])
{
  const queue = modules.map((o: Module) => {
    switch (o.module)
    {
      case 'articles':
        return requestArticles(o.options);
      case 'nests':
        return requestNests(o.options);
      case 'apps':
        return requestApps(o.options)
      case 'json':
        return requestJSON(o.options)
    }
  }).filter(Boolean);
  return await Promise.all(queue);
}
