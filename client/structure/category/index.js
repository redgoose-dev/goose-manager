import { dateStore } from '@/store/app.js'
import { request } from '@/libs/api.js'

function filteringNest(nest)
{
  if (!nest) throw new Error(nest.message)
  return {
    srl: nest.srl,
    code: nest.code,
    name: nest.name,
  }
}
function filteringCategories(src)
{
  if (!(src?.index?.length > 0)) return []
  const date = dateStore()
  return src.index.map(o => {
    return {
      srl: o.srl,
      title: o.name,
      meta: [ date.format(o.created_at, 'date') ],
      status: [ { label: '데이터', value: o.count } ],
    }
  })
}

export async function getData(module, moduleSrl)
{
  switch (module)
  {
    case 'nest':
      const { nest, category } = await request('/mix/', {
        method: 'post',
        body: [
          {
            key: 'category',
            url: '/category/',
            params: {
              module: 'nest',
              module_srl: moduleSrl,
              page: 0,
              order: 'turn ASC',
              mod: 'count',
            },
          },
          {
            key: 'nest',
            url: '/nest/{srl}/',
            params: {
              srl: moduleSrl,
              field: 'srl,code,name',
            },
          },
        ],
      })
      return {
        nest: filteringNest(nest),
        category: filteringCategories(category),
      }
    case 'json':
      const res = await request('/category/', {
        query: {
          module: 'json',
          page: 0,
          order: 'turn ASC',
          mod: 'count',
        },
      })
      return {
        category: filteringCategories(res?.data),
      }
  }
}

export async function changeOrder(module, moduleSrl, srls)
{
  let data = {
    module,
    srls,
  }
  if (moduleSrl) data['module_srl'] = moduleSrl
  await request('/category/change-order/', {
    method: 'patch',
    body: data,
  })
}
