import { request, formData } from '../../libs/api.js'
import { defaultContent, checkTime, filteringData } from './libs.js'
import { preferenceStore } from '../../store/app.js'

export async function getLastData()
{
  const preference = preferenceStore()
  let result, postDate
  const query = { order: 'srl', sort: 'desc', size: 1 }
  let res = await request('/checklist/', { query })
  let lastItem = res.data?.index[0]
  if (lastItem)
  {
    postDate = checkTime(lastItem?.created_at, preference.checklist.resetTime)
    if (postDate)
    {
      // add data
      res = await request('/checklist/', {
        method: 'put',
        body: formData({
          content: (lastItem?.content) ? lastItem?.content.replace(/\- \[x\]/g, '- [ ]') : defaultContent,
          regdate: postDate,
        })
      })
      if (!res?.data) throw new Error('Not found add data.')
      res = await request(`/checklist/${res.data}/`)
      if (!res?.data) throw new Error('Not found data.')
      result = res.data
    }
    else
    {
      result = lastItem
    }
  }
  else
  {
    // add data
    res = await request('/checklist/', {
      method: 'put',
      body: formData({
        content: defaultContent,
      }),
    })
    if (!res?.data) throw new Error('Not found add data.')
    res = await request(`/checklist/${res.data}/`)
    if (!res?.data) throw new Error('Not found data.')
    result = res.data
  }
  return result
}

export async function getData(srl)
{
  const result = await getLastData()
  return filteringData(result)
}

export async function editData(srl, content)
{
  if (!srl) throw new Error('no srl')
  if (!content) throw new Error('no content')
  await request(`/checklist/${srl}/`, {
    method: 'patch',
    body: formData({ content }),
  })
}
