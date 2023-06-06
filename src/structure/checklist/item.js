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

function filteringFiles(src)
{
  if (!src) return []
  return src.map(o => {
    return {
      name: o.name,
      path: o.path,
      size: o.size,
    }
  })
}

export async function getLastItem()
{
  const preference = preferenceStore()
  let result, files, postDate
  const params = { order: 'srl', sort: 'desc', size: 1 }
  let res = await get(`/checklist/`, params)
  const lastItem = res.data?.index[0]
  postDate = checkTime(lastItem?.regdate, preference.checklist.resetTime)
  // console.log(postDate)
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
  // get files
  try
  {
    res = await get(`/files/`, {
      module: 'checklist',
      target: result.srl,
      unlimit: 1,
    })
    files = filteringFiles(res.data?.index)
  }
  catch (_) {}
  return {
    ...filteringItem(result),
    files,
  }
}

export async function getItem(srl)
{
  if (!srl) throw new Error('no srl')
  let [ items, files ] = await Promise.all([
    get(`/checklist/${srl}/`),
    get('/files/', {
      module: 'checklist',
      target: srl,
      unlimit: 1,
    }),
  ])
  if (!items.success) throw new Error(items.message || 'Unknown error')
  return {
    ...filteringItem(items.data),
    files: filteringFiles(files.data?.index),
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
