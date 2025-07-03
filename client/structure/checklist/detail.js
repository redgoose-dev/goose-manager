import { request } from '../../libs/api.js'
import { filteringData } from './libs.js'

export async function getData(srl)
{
  const { checklist, file } = await request(`/mix/`, {
    method: 'post',
    body: [
      {
        key: 'checklist',
        url: '/checklist/{srl}/',
        params: { srl },
      },
      {
        key: 'file',
        url: '/file/',
        params: {
          module: 'checklist',
          module_srl: srl,
          fields: 'srl,code,name,mime,size,json,created_at',
        },
      }
    ],
  })
  if (!checklist?.data) throw new Error(checklist?.message || 'No checklist data.')
  return {
    data: filteringData(checklist?.data || null),
    file: file.data?.index?.length > 0 ? file.data.index : [],
  }
}
