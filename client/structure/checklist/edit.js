import { request, formData } from '../../libs/api.js'
import { getLastData } from './today.js'
import { filteringData } from './libs.js'

export async function getData(srl = NaN)
{
  let res
  if (isNaN(srl))
  {
    res = await getLastData()
  }
  else
  {
    res = await request(`/checklist/${srl}/`)
  }
  return filteringData(res)
}

export async function submit(srl, content)
{
  await request(`/checklist/${srl}/`, {
    method: 'patch',
    body: formData({ content }),
  })
}
