import { get } from '../../libs/api'
import { getDate } from '../../libs/date'
import { createFullPath } from '../files/util'
import { ARTICLE_TYPE } from '../../libs/consts'

interface Module {
  module: string
  options?: {
    size?: number
  }
}

async function requestArticles({ size }: any = {}): Promise<any>
{
  let res = await get('/articles/', {
    field: 'srl,category_srl,title,hit,star,type,json,`order`',
    order: 'srl',
    sort: 'desc',
    size,
    visible_type: 'all',
  })
  if (!res.success) throw new Error(res.message)
  return {
    module: 'articles',
    index: (res.data as any).index.map((item: any) => {
      return {
        srl: item.srl,
        title: item.title,
        href: `/articles/${item.srl}/`,
        meta: [
          ARTICLE_TYPE[item.type],
          item.order,
          `조회수: ${item.hit}`,
          `좋아요: ${item.star}`,
        ],
        image: createFullPath(item.json?.thumbnail?.path),
      };
    }),
  }
}

async function requestNests({ size }: any = {}): Promise<any>
{
  let res = await get('/nests/', {
    field: 'srl,id,name,regdate,json',
    order: 'srl',
    sort: 'desc',
    size,
  })
  if (!res.success) throw new Error(res.message)
  return {
    module: 'nests',
    index: (res.data as any).index.map((item: any) => {
      return {
        srl: item.srl,
        title: item.name,
        href: `/nests/${item.srl}/articles/`,
        meta: [
          `번호: ${item.srl}`,
          `아이디: ${item.id}`,
          getDate(item.regdate),
        ],
        useCategory: Number(item.json.useCategory) === 1,
      }
    }),
  }
}

async function requestApps({ size }: any = {}): Promise<any>
{
  let res = await get('/apps/', {
    field: 'srl,id,name,regdate',
    order: 'srl',
    sort: 'desc',
    size,
  })
  if (!res.success) throw new Error(res.message)
  return {
    module: 'apps',
    index: (res.data as any).index.map((item: any) => {
      return {
        srl: item.srl,
        title: item.name,
        meta: [
          `번호: ${item.srl}`,
          `아이디: ${item.id}`,
          getDate(item.regdate),
        ],
      }
    }),
  }
}

async function requestJSON({ size }: any = {}): Promise<any>
{
  let res = await get('/json/', {
    field: 'srl,name,regdate',
    order: 'srl',
    sort: 'desc',
    size,
  })
  if (!res.success) throw new Error(res.message)
  return {
    module: 'json',
    index: (res.data as any).index.map((item: any) => {
      return {
        srl: item.srl,
        title: item.name,
        href: `/json/${item.srl}/`,
        meta: [
          `번호: ${item.srl}`,
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
