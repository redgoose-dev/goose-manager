import { useRoute } from 'vue-router'
import { preferenceStore } from '../../store/preference'
import { get } from '../../libs/api'
import { createFullPath } from './util'
import { getByte } from '../../libs/string'
import { getDate } from '../../libs/date'

export async function getItems()
{
  const preference = preferenceStore()
  const route = useRoute()
  let res = await get('/files/', {
    order: 'srl',
    sort: 'desc',
    size: preference.files.pagePerSize,
    page: Number(route.query.page) > 1 ? Number(route.query.page) : undefined,
  })
  if (!res.success) throw new Error(res.message)
  return {
    total: res.data?.total,
    index: res.data?.index.map((item: any) => ({
      srl: item.srl,
      title: item.name,
      href: createFullPath(item.path),
      image: /^image/.test(item.type) ? createFullPath(item.path) : null,
      meta: [
        item.type,
        `Size: ${getByte(item.size)}`,
        `Date: ${getDate(item.regdate)}`,
        `Module: ${item.module}`,
        `srl: ${item.target_srl}`,
      ].filter(Boolean),
    })),
  }
}
