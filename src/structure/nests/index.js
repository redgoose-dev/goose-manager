import { get } from '../../libs/api'
import { getDate } from '../../libs/date'

// apps data
async function requestApps()
{
  const { data } = await get('/apps/', {
    field: 'srl,id,name,description',
    ext_field: 'count_nests',
    unlimit: 1,
  })
  return (data?.index?.length > 0) ? data?.index : []
}
function filteringApps(res)
{
  return res.map(item => ({
    srl: item.srl,
    name: item.name,
    id: item.id,
    countNests: Number(item.count_nest || 0),
    description: item.description,
  }))
}

// nests data
async function requestNests()
{
  const { data } = await get(`/nests/`, {
    ext_field: 'count_articles',
    visible_type: 'all',
    unlimit: 1,
  })
  return (data?.index?.length > 0) ? data?.index : []
}
function filteringNests(res)
{
  return res.map(item => {
    return {
      srl: item.srl,
      appSrl: item.app_srl,
      title: `${item.name}(${item.count_article || 0})`,
      meta: [
        getDate(item.regdate),
        `아이디:${item.id}`,
      ],
      useCategory: item.json?.useCategory === '1',
    }
  })
}

/**
 * get data
 * @return {Promise<array>}
 * @throws {Error}
 */
export default async function getData()
{
  // get data
  let [ apps, nests ] = await Promise.all([
    requestApps(),
    requestNests(),
  ])
  // get apps
  apps = filteringApps(apps)
  // get nests
  nests = filteringNests(nests)

  // combine items
  return apps.map(app => {
    let item = Object.assign({}, app)
    item.nests = nests.filter(nest => (item.srl === nest.appSrl))
    delete item.appSrl
    return item
  })
}
