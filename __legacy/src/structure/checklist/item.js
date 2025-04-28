import { get, post, formData } from '../../libs/api'
import { defaultContent, checkTime } from './lib'
import { preferenceStore } from '../../store/preference'

function filteringItem(src)
{
  return {
    srl: src.srl,
    content: src.content,
    date: src.regdate,
    percent: src.percent,
  }
}

export async function getLastItem()
{
  const preference = preferenceStore()
  let result, postDate
  const params = { order: 'srl', sort: 'desc', size: 1 }
  let res = await get(`/checklist/`, params)
  let lastItem = res.data?.index[0]
  if (lastItem)
  {
    postDate = checkTime(lastItem?.regdate, preference.checklist.resetTime)
    // return
    if (postDate)
    {
      // add item
      res = await post('/checklist/?return=1', formData({
        content: (lastItem?.content) ? lastItem.content.replace(/\- \[x\]/g, '- [ ]') : defaultContent,
        regdate: postDate,
      }))
      if (!res?.data) throw new Error('Not found add data.')
      result = res.data
    }
    else
    {
      result = lastItem
    }
  }
  else
  {
    // add item
    res = await post('/checklist/?return=1', formData({
      content: defaultContent,
      regDate: null,
    }))
    if (!res?.data) throw new Error('Not found add data.')
    result = res.data
  }
  return {
    ...filteringItem(result),
  }
}

export async function getItem(srl)
{
  if (!srl) throw new Error('no srl')
  let [ items ] = await Promise.all([
    get(`/checklist/${srl}/`),
  ])
  if (!items.success) throw new Error(items.message || 'Unknown error')
  return {
    ...filteringItem(items.data),
  }
}

export async function editItem(srl, content)
{
  if (!srl) throw new Error('no srl')
  if (!content) throw new Error('no content')
  const { success, message } = await post(`/checklist/${srl}/edit/`, formData({
    content,
  }))
  if (!success) throw new Error(message || 'Unknown error')
}
