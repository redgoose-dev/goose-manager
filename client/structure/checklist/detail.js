import { request } from '../../libs/api.js'
import { filteringData } from './libs.js'

export async function getData(srl)
{
  const res = await request(`/checklist/${srl}/`, {
    query: {
      mod: 'count-file',
    },
  })
  if (!res?.data) throw new Error(res?.message || 'No checklist data.')
  return filteringData(res?.data)
}
