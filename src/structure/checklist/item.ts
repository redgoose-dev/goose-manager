import { get, post, formData } from '../../libs/api'
import { defaultContent, checkTime } from './lib'
import { preferenceStore } from '../../store/preference'

function filteringItem(src: any): any
{
  return {
    srl: src.srl,
    content: src.content,
    date: src.regdate,
    percent: src.percent,
  }
}

function filteringFiles(src: any[]): any[]
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

export async function getLastItem(): Promise<any>
{
  const preference = preferenceStore()
  let result, files
  let params = { order: 'srl', sort: 'desc', size: 1 }
  let res = await get(`/checklist/`, params)
  let item = res.data?.index[0]
  if (!item || (!!item && checkTime(item.regdate, preference.checklist.resetTime)))
  {
    // add item
    res = await post('/checklist/?return=1', formData({
      content: (item?.content) ? item.content.replace(/\- \[x\]/g, '- [ ]') : defaultContent,
    }))
    if (!res?.data) throw new Error('Not found add data.')
    result = res.data
  }
  else
  {
    result = item
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

export async function getItem(srl: number): Promise<any>
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
  if (!items.success) throw new Error(items.message)
  return {
    ...filteringItem(items.data),
    files: filteringFiles(files.data?.index),
  }
}

export async function editItem(srl: number, content: string): Promise<void>
{
  if (!srl) throw new Error('no srl')
  if (!content) throw new Error('no content')
  const { success, message } = await post(`/checklist/${srl}/edit/`, formData({
    content,
  }))
  if (!success) throw new Error(message)
}
