import { request } from '../../libs/api.js'
import { getDate } from '../../libs/date.js'

function filteringNest(nest)
{
  if (!nest.data) throw new Error(nest.message)
  return {
    srl: nest.data.srl,
    code: nest.data.code,
    name: nest.data.name,
  }
}
function filteringCategories(src)
{
  if (!(src.data?.index?.length > 0)) return []
  return src.data.index.map(o => {
    console.log(o)
    return {
      srl: o.srl,
      title: o.name,
      meta: [ getDate(o.created_at) ],
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
              order: 'turn',
              sort: 'asc',
              unlimited: '1',
              mod: 'count',
            },
          },
          {
            key: 'nest',
            url: '/nest/{srl}/',
            params: {
              srl: moduleSrl,
              fields: 'srl,code,name',
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
          order: 'turn',
          sort: 'asc',
          unlimited: '1',
          mod: 'count',
        },
      })
      return {
        category: filteringCategories(res),
      }
  }
}
