import { get } from '../../libs/api'
import { preferenceStore } from '../../store/preference'

export declare interface NestJSON {
  useCategory: string
  useComment: string
  thumbnail: {
    width: number
    height: number
    type: string
  }
  files: {
    count: number
    sizeSingle: number
  }
}

async function requestApps(): Promise<[]>
{
  let res = await get('/apps/', {
    field: 'srl,id,name',
    unlimit: 1,
  })
  return res.data?.index || []
}
function filteringApps(src: any): []
{
  return src.map((item: any) => ({
    value: item.srl,
    label: `[${item.id}] ${item.name}`,
  }))
}

async function requestNest(srl: number): Promise<any>
{
  let res = await get(`/nests/${srl}/`)
  return res.data
}
function filteringNest(src: any): any
{
  return {
    ...src,
    json: setJson(src.json || {}),
  }
}
export function setJson(src: any = {}): NestJSON
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

export default async function getData(mode: string, srl: number): Promise<any>
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
