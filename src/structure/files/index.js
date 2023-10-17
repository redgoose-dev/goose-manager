import { useRoute } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { get } from '../../libs/api'
import { createFullPath } from './util'
import { getByte } from '../../libs/string'
import { getDate } from '../../libs/date'

let route

export async function getItems()
{
  if (!route) route = useRoute()
  const preference = preferenceStore()
  let res = await get('/files/', {
    order: 'srl',
    sort: 'desc',
    size: preference.files.pagePerSize,
    page: Number(route.query.page) > 1 ? Number(route.query.page) : undefined,
  })
  if (!res.success) throw new Error(res.message)
  return {
    total: res.data?.total,
    index: res.data?.index.map(item => ({
      srl: item.srl,
      title: item.name,
      href: createFullPath(item.path),
      image: /^image/.test(item.type) ? createFullPath(item.path) : null,
      meta: [
        item.type,
        `사이즈:${getByte(item.size)}`,
        `날짜:${getDate(item.regdate)}`,
        `모듈: ${item.module}`,
        `번호: ${item.target_srl}`,
      ].filter(Boolean),
      json: item.json,
    })),
  }
}
