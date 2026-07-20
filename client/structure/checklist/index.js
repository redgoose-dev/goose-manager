import { dateStore, preferenceStore } from '@/store/app.js'
import { request } from '@/libs/api.js'
import { checkTime } from './libs.js'

export async function getData(query = {}, options = {})
{
  const { size } = options
  const res = await request('/checklist/', {
    query: {
      field: 'srl,percent,created_at',
      page: query.page > 1 ? query.page : undefined,
      size: size || 24,
      order: `c.${query.order || 'srl'} ${query.sort ? query.sort.toUpperCase() : 'DESC'}`,
      start: query.start,
      end: query.end,
      content: query.q,
    },
  })
  if (!res?.data?.index?.length > 0) return { total: 0, index: [] }
  const preference = preferenceStore()
  const date = dateStore()
  const now = new Date()
  return {
    total: res.data.total,
    index: res.data.index.map(o => {
      return {
        srl: o.srl,
        title: `${date.format(o.created_at, 'date')} ${date.format(o.created_at, 'week')}`,
        percent: o.percent,
        today: !checkTime(o.created_at, preference.checklist.resetTime, now, preference._timezone),
      }
    }),
  }
}
