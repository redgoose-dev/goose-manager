import { useRoute } from 'vue-router'
import { preferenceStore } from '../../store/app.js'
import { request } from '../../libs/api.js'

let _route

export async function getData(module, moduleSrl)
{
  if (!_route) _route = useRoute()
  const preference = preferenceStore()
  const res = await request('/file/', {
    query: {
      module,
      module_srl: moduleSrl,
      order: 'srl',
      sort: 'desc',
      size: preference.file.pagePerSize,
      page: Number(_route.query.page) > 1 ? Number(_route.query.page) : undefined,
    }
  })
  if (!(res?.data)) return { total: 0, index: [] }
  return {
    total: res.data.total || 0,
    index: res.data.index?.length > 0 ? res.data.index : [],
  }
}
