import { useRoute } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { filtersStore } from '../../store/filters'
import { get } from '../../libs/api'
import { getFilterKey } from '../../libs/util'
import { dateFormat } from '../../libs/date'
import { checkTime } from './lib'

let route

export async function getData()
{
  if (!route) route = useRoute()
  const filterKey = getFilterKey()
  const preference = preferenceStore()
  const filters = filtersStore()
  const { dateStart, dateEnd, sort } = filters.getFilter(filterKey) || {}
  let params = {
    field: 'srl,percent,regdate',
    order: 'srl',
    size: preference.checklist.pageCount,
    page: Number(route?.query?.page || 1),
    sort: sort,
  }
  if (dateStart && dateEnd)
  {
    params.start = dateStart
    params.end = dateEnd
  }
  if (route.query?.q) params.q = route.query.q
  const { success, message, data } = await get('/checklist/', params)
  if (!success) throw new Error(message)
  return {
    total: data?.total,
    index: data?.index.map(item => {
      const regdate = item.regdate.split(' ')[0].split('-').map(o => Number(o))
      const date = new Date(regdate[0], regdate[1] - 1, regdate[2])
      return {
        ...item,
        title: dateFormat(date, preference.checklist.dateFormat),
        today: !checkTime(item.regdate, preference.checklist.resetTime),
      }
    }),
  }
}
