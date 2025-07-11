import { request } from '../../libs/api.js'
import { getDate } from '../../libs/date.js'

function filteringApp(src)
{
  if (!(src.index?.length > 0)) return []
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
  if (!(src.index?.length > 0)) return []
  return src.index.map(o => {
    return {
      srl: o.srl,
      appSrl: o.app_srl,
      title: `${o.name}`,
      description: o.description,
      meta: [ getDate(o.created_at), `코드:${o.code}` ],
      status: [
        { label: '아티클 수', value: o.count_article || 0 },
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
          fields: 'srl,code,name,description',
          mod: 'count-nest',
          unlimited: '1',
        },
      },
      {
        key: 'nests',
        url: '/nest/',
        params: {
          mod: 'count-article',
          unlimited: '1',
        },
      },
    ],
  })
  // filtering data
  apps = filteringApp(apps.data)
  nests = filteringNest(nests.data)
  // combine data
  return apps.map(app => ({
    ...app,
    nests: nests.filter(nest => (app.srl === nest.appSrl)),
  }))
}
