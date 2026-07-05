import { request } from '@/libs/api.js'
import { getDate } from '@/libs/date.js'

function filteringApp(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    return {
      srl: o.srl,
      name: o.name,
      code: o.code,
      description: o.description,
      countNest: Number(o.count_nest || 0),
    }
  })
}

function filteringNest(src)
{
  if (!(src?.index?.length > 0)) return []
  return src.index.map(o => {
    return {
      srl: o.srl,
      appSrl: o.app_srl,
      title: `[${o.code}] ${o.name}`,
      description: o.description,
      meta: [
        `번호:${o.srl}`,
        getDate(o.created_at),
      ],
      status: [
        { label: '아티클', value: o.count_article || 0 },
      ],
      useCategory: o.json.useCategory === '1',
    }
  })
}

export async function getData()
{
  let { apps, nests } = await request('/mix/', {
    method: 'post',
    body: [
      {
        key: 'apps',
        url: '/app/',
        params: {
          field: 'srl,code,name,description',
          page: 0,
          order: 'srl DESC',
          mod: 'count-nest',
        },
      },
      {
        key: 'nests',
        url: '/nest/',
        params: {
          page: 0,
          order: 'srl DESC',
          mod: 'count-article',
        },
      },
    ],
  })
  // filtering data
  apps = filteringApp(apps)
  nests = filteringNest(nests)
  // combine data
  return apps.map(app => ({
    ...app,
    nests: nests.filter(nest => (app.srl === nest.appSrl)),
  }))
}
