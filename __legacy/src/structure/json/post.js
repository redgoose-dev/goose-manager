import { get } from '../../libs/api'

async function requestJson(srl)
{
  const res = await get(`/json/${srl}/`)
  return {
    category_srl: res.data?.category_srl || null,
    name: res.data?.name,
    description: res.data?.description,
    json: res.data?.json,
    path: res.data?.path,
  }
}

async function requestCategories()
{
  const res = await get('/categories/', {
    module: 'json',
    field: 'srl,name,turn',
    order: 'turn',
    sort: 'asc',
    strict: 1,
  })
  return res.data?.index?.length > 0 ? res.data?.index.map(o => {
    return {
      label: o.name,
      value: o.srl,
    }
  }) : []
}

export async function getData(srl)
{
  let json, categories
  if (srl)
  {
    ;[ json, categories ] = await Promise.all([
      requestJson(srl),
      requestCategories(),
    ])
  }
  else
  {
    categories = await requestCategories()
  }
  return {
    json,
    categories,
  }
}
