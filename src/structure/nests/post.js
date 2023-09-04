import { get } from '../../libs/api'
import { preferenceStore } from '../../store/preference'

async function requestApps()
{
  let res = await get('/apps/', {
    field: 'srl,id,name',
    unlimit: 1,
  })
  return res.data?.index || []
}
function filteringApps(src)
{
  return src.map(item => ({
    value: item.srl,
    label: `[${item.id}] ${item.name}`,
  }))
}

async function requestNest(srl)
{
  let res = await get(`/nests/${srl}/`)
  return res.data
}
function filteringNest(src)
{
  return {
    ...src,
    json: setJson(src.json || {}),
  }
}
export function setJson(src = {})
{
  const preference = preferenceStore()
  return {
    useCategory: src.useCategory || '0',
    useComment: src.useComment || '0',
    thumbnail: {
      width: Number(src.thumbnail?.width || 640),
      height: Number(src.thumbnail?.height || 480),
      type: src.thumbnail?.type || 'crop',
    },
    files: {
      count: Number(src.files?.count || preference.nests.uploadFileCount),
      sizeSingle: Number(src.files?.sizeSingle || preference.nests.limitUploadFile),
    },
  }
}

export default async function getData(mode, srl)
{
  if (!mode) return { apps: [], nest: null }
  const queue = [
    requestApps(),
    srl && requestNest(srl),
  ].filter(Boolean)
  const [ apps, nest ] = await Promise.all(queue)
  return {
    apps: filteringApps(apps),
    nest: filteringNest(nest || {}),
  }
}
