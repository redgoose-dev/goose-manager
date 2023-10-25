import { get, post, formData } from '../../libs/api'
import { createFullPath } from './util'

function filteringItemGlobal(src)
{
  return {
    name: src.name,
    path: src.path,
    pathFull: createFullPath(src.path),
    size: src.size,
    type: src.type,
    badge: [],
    json: src.json || {},
  }
}
function filteringItemPost(src)
{
  return {
    srl: src.srl,
    name: src.name,
    path: src.path,
    pathFull: createFullPath(src.path),
    size: src.size,
    type: src.type,
    badge: [],
    json: src.json || {},
  }
}

export async function getItemsGlobal(path)
{
  if (!path) throw new Error('no path')
  const { success, message, data } = await get(`/files/get-files/${path}/`, {
    order: 'date',
    sort: 'desc',
  })
  if (!success) throw new Error(message)
  return data?.index.map(o => filteringItemGlobal(o))
}
export async function uploadFileGlobal(file, path)
{
  if (!file || !path) throw new Error('no file or path')
  let res = await post('/files/upload-file/', formData({ sub_dir: path, file }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (!res.success) throw new Error(res.message)
  return filteringItemGlobal(res.data)
}
export async function removeFilesGlobal(src)
{
  if (src.length <= 0) throw new Error('no path')
  let res = await Promise.all(src.map(item => {
    return post('/files/remove-file/', formData({ path: item.path }))
  }))
  return res.map((res, key) => {
    return res.success ? src[key].key : res.message
  })
}

/**
 * get items form post
 * @param {string} module
 * @param {number} srl
 * @return {Promise<object[]>}
 */
export async function getItemsPost(module, srl)
{
  if (!(module && srl)) throw new Error('no module or srl')
  const { success, message, data } = await get('/files/', {
    order: 'srl',
    sort: 'asc',
    unlimit: 1,
    module,
    target: srl,
  })
  if (!success) throw new Error(message)
  return data?.index.map(o => filteringItemPost(o))
}
export async function uploadFilePost(file, module, srl)
{
  if (!(file && module && srl)) throw new Error('no file or module or srl')
  let res = await post(`/files/`, formData({
    module,
    target_srl: srl,
    file,
  }), {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (!res.success) throw new Error(res.message)
  return filteringItemPost(res.data)
}
export async function removeFilesPost(src)
{
  if (src.length <= 0) throw new Error('no item')
  let res = await Promise.all(src.map(item => {
    return post(`/files/${item.srl}/delete/`)
  }))
  return res.map((res, key) => {
    return res.success ? src[key].key : res.message
  })
}
