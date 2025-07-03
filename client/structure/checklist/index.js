import { request } from '../../libs/api.js'
import { dateFormat } from '../../libs/date.js'
import { checkTime } from './libs.js'
import { preferenceStore } from '../../store/app.js'

function filtering({ data })
{
  if (!data) return { total: 0, index: [] }
  const preference = preferenceStore()
  return {
    total: data.total,
    index: data.index.map(o => {
      return {
        srl: o.srl,
        title: dateFormat(new Date(o.created_at), preference.checklist.dateFormat),
        percent: o.percent,
        today: !checkTime(o.created_at, preference.checklist.resetTime),
      }
    }),
  }
}

export async function getData(query = {}, options = {})
{
  const { size } = options
  const res = await request('/checklist/', {
    query: {
      fields: 'srl,percent,created_at',
      page: query.page > 1 ? query.page : undefined,
      size: size || 24,
      order: query.order,
      sort: query.sort,
      start: query.start,
      end: query.end,
      content: query.q,
    },
  })
  return filtering(res)
}
